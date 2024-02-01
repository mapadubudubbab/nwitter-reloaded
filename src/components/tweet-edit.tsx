import { useState } from "react";
import { styled } from "styled-components";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ITweet } from "./timeline";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 20px;
  background-color: black;
  border: 2px solid white;
  border-radius: 20px;
  font-size: 16px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  color: white;
  resize: none;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  border: 1px solid currentColor;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  color: #1d9bf0;
  text-align: center;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  padding: 10px 0px;
  background-color: #1d9bf0;
  border: none;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function TweetEdit({ photo, tweet, id, setIsEditing }: ITweet & { setIsEditing: React.Dispatch<React.SetStateAction<boolean>> }) {
    {
        const [isLoading, setLoading] = useState(false);
        const [tweetEdit, setTweetEdit] = useState(tweet);
        const [fileEdit, setFileEdit] = useState<File | null>(null);

        const editTweet = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setTweetEdit(e.target.value);
        };
        const editFile = (e: React.ChangeEvent<HTMLInputElement>) => {
            const { files } = e.target;
            if (files && files.length === 1 && files[0].size < 1 * 1024 * 1024) {
                setFileEdit(files[0]);
            } else if (files && files[0].size > 1 * 1024 * 1024) {
                alert("File size should be less than 1MB");
            }
        }
        const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const user = auth.currentUser;
            if (!user || isLoading || tweetEdit === "" || tweetEdit.length > 180) {
                return;
            }
            try {
                setLoading(true);
                const tweetRef = doc(db, "tweets", id);
                await updateDoc(tweetRef, {
                    tweet: tweetEdit,
                });

                if (fileEdit && photo) {
                    const photoRef = ref(storage, `tweets/${user.uid}-${user.displayName}/${id}`);
                    await deleteObject(photoRef);
                }

                const locationRef = ref(
                    storage, `tweets/${user.uid}-${user.displayName}/${id}`
                );

                if (fileEdit) {
                    if (fileEdit.size > 1 * 1024 * 1024) {
                        alert("File size should be less than 1MB");
                        return;
                    }

                    const result = await uploadBytes(locationRef, fileEdit);
                    const url = await getDownloadURL(result.ref);

                    await updateDoc(tweetRef, {
                        photo: url
                    });
                }

                setTweetEdit("");
                setFileEdit(null);
                setIsEditing(false);
            } catch (error) {
                console.error("Error editing tweet:", error);
            } finally {
                setLoading(false);
            }
        };

        return (
            <Form onSubmit={onSubmit}>
                <TextArea
                    required
                    rows={5}
                    maxLength={180}
                    onChange={editTweet}
                    value={tweetEdit}
                />
                <AttachFileButton htmlFor={`editFile${id}`}>
                    {fileEdit ? "Photo added ✅" : photo ? "Change photo" : "Add photo"}
                </AttachFileButton>
                <AttachFileInput
                    onChange={editFile}
                    id={`editFile${id}`}
                    type="file"
                    accept="image/*"
                />
                <SubmitBtn
                    type="submit"
                    value={isLoading ? "Editing..." : "Edit Tweet"}
                />
            </Form>
        )
    }
}