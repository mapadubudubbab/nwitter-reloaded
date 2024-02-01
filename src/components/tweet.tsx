import { deleteDoc, doc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { ITweet } from "./timeline";
import styled from "styled-components";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import TweetEdit from "./tweet-edit";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  &:last-child:not(:first-child) {
    align-items: center;
  }
`;
const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
  line-height: 1.4;
`;

const BtnWrap = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const DeleteButton = styled.button`
background-color: #666;
border: 0;
border-radius: 5px;
font-weight: 600;
font-size: 12px;
color: white;
text-transform: uppercase;
cursor: pointer;
padding: 5px 10px;
`;

const EditButton = styled.button`
padding: 5px 10px;
background-color: #1d9bf0;
border: 0;
border-radius: 5px;
font-weight: 600;
font-size: 12px;
color: white;
text-transform: uppercase;
cursor: pointer;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
    const [isEditing, setIsEditing] = useState(false);
    const user = auth.currentUser
    const onDelete = async () => {
        const ok = window.confirm("Are you sure you want to delete this tweet?");
        if (!ok || user?.uid != userId) return;
        try {
            await deleteDoc(doc(db, "tweets", id));
            if (photo) {
                const photoRef = ref(storage, `tweets/${userId}-${username}/${id}`);
                await deleteObject(photoRef);
            }
        } catch (error) {
            console.log(error);
        } finally {

        }
    };
    const onEdit = () => {
        setIsEditing(prev => !prev);
    }
    return (
        <Wrapper>
            <Column>
                <Username>{username}</Username>
                {isEditing ? (
                    <TweetEdit
                        tweet={tweet}
                        photo={photo}
                        id={id}
                        setIsEditing={setIsEditing} userId={""} username={""} createdAt={0}                    />
                ) : (
                    <Payload>{tweet}</Payload>
                )}
                {user?.uid === userId ? (
                    <BtnWrap>
                        <DeleteButton onClick={onDelete}>Delete</DeleteButton>
                        <EditButton onClick={onEdit}>
                            {isEditing ? "Cancel" : "Edit"}
                        </EditButton>
                    </BtnWrap>) : null}
            </Column>
            <Column>
                {photo ? <Photo src={photo} /> : null}
            </Column>

        </Wrapper>
    );
}