import React from "react";
import Title from "../components/Title/Title";
import UserForm from "../components/UserForm/UserForm";

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-between gap-16">
            <Title className="mt-16" />
            <UserForm />
        </div>
    );
};

export default Home;
