import React, {
    PropsWithChildren,
    createContext,
    useEffect,
    useState,
} from "react";

export const UserContext = createContext({
    name: "",
    updateName: (newName: string) => {},
    saveName: (newName: string) => {},
});

const UserProvider = ({ children }: PropsWithChildren) => {
    const [name, setName] = useState("");

    const updateName = (newName: string) => {
        setName(newName);
    };

    const saveName = (newName: string) => {
        localStorage.setItem("name", name);
    };

    useEffect(() => {
        const storedName = localStorage.getItem("name");
        if (storedName) updateName(storedName);
    }, []);

    return (
        <UserContext.Provider value={{ name, updateName, saveName }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
