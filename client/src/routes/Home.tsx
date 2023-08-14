import { useState } from "react";
import Title from "../components/Title/Title";
import UserForm from "../components/UserForm/UserForm";

const Home = () => {
    const searchParams = new URLSearchParams(document.location.search);
    const roomIdFromLink = searchParams.get("roomId"); // null | existing room | non-existing room

    return (
        <div className="flex flex-col items-center justify-between gap-16">
            <Title className="mt-16" />
            <UserForm roomId={roomIdFromLink} />
        </div>
    );
};

export default Home;
