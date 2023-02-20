import profileIcon from "../assets/profileIcon.svg";
import { useEffect, useState } from "react";
import getPhotoUrl from "get-photo-url";
import {db} from "./dexie";


const Bio = () => {
    const [userDetails, setUserDetails] = useState({
        name: "Shin Gwan Gwi",
        about: "Come and fight, show me your no mercy"
    });

    useEffect( () => {
        const setDataFromDb = async () => {
            const userDetailsFromDb = await db.bio.get('info');
            const profilePhotoFromDb = await db.bio.get('profilePhoto');

            userDetailsFromDb  && setUserDetails(userDetailsFromDb)
            profilePhotoFromDb && setProfilePhoto(profilePhotoFromDb)
        }

        setDataFromDb()
    }, [])

    const [editFormIsOpen, setEditFormIsOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(profileIcon);

    const updateUserDetails = async (e) => {
        e.preventDefault();

        const objectData = {
            name: e.target.nameOfUser.value,
            about: e.target.aboutUser.value
        }
        setUserDetails (objectData) ;
        //update bio data here
        await db.bio.put(objectData, 'info')
        setEditFormIsOpen(false)
    }

    const updateProfilePhoto = async () => {
        //get selected photo
        const newProfilePhoto = await getPhotoUrl('#profilePhotoInput');
        setProfilePhoto(newProfilePhoto);
        await db.bio.put(newProfilePhoto, "profilePhoto")

        //update state here
    }

    const editButton = <button onClick={() => setEditFormIsOpen(true)}> Edit </button>

    const editForm = (
        <form action="" className="edit-bio-form" onSubmit={(e) => updateUserDetails(e)}>
            <input type="text" id="" name="nameOfUser" placeholder="Your Name" defaultValue={userDetails?.name} />
            <input type="text" id="" name="aboutUser" placeholder="About You" defaultValue={userDetails?.about} />
            <button type="button" className="cancel-button" onClick={() => setEditFormIsOpen(false)}>Cancel</button>
            <button type="Submit" > Save </button>
        </form>
    );

    


    return (
        <section className="bio">
            <input type="file" accept="image/*" name="photo" id="profilePhotoInput" onClick={updateProfilePhoto} />
            <label htmlFor="profilePhotoInput">
                <div className="profile-photo" role="button" title="Click to edit photo">
                    <img src={profilePhoto} alt="profile" />
                </div>
            </label>
            
            <div className="profile-info">
                <p className="name"> {userDetails.name} </p>
                <p className="about"> {userDetails.about} </p>
                
                {editFormIsOpen ? editForm : editButton}
            </div>
        </section>
        
            
    )
}

export default Bio;