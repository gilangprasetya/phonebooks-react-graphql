import React, { useEffect, useState, useRef, useCallback } from "react";
import PhoneHeader from "./PhoneHeader";
import PhoneList from "./PhoneList";
import axios from "axios";
import { GET_CONTACTS, CREATE_CONTACT } from "../graphql/gql";
import { useLazyQuery, useMutation } from "@apollo/client";

export default function PhoneBox() {
    const [data, setData] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const totalPagesRef = useRef(1);
    const isLoadingRef = useRef(false);
    const [searchKeyword, setSearchKeyword] = useState("");

    const [fetchData, { loading, data: fetchedData }] = useLazyQuery(GET_CONTACTS, {
        fetchPolicy: "network-only",
        variables: { sort: sortOrder, page: currentPage, keyword: searchKeyword },
        onCompleted: (result) => {
            const newContacts = result.contacts;

            setData((prevData) => {
                if (currentPage === 1) return newContacts;
                return [
                    ...prevData,
                    ...newContacts.filter((contact) => {
                        return !prevData.some((existingContact) => existingContact.id === contact.id);
                    }),
                ];
            });
            totalPagesRef.current = result.pages;
            isLoadingRef.current = false;
        },
        onError: (error) => {
            console.error("Error fetching data:", error);
        },
    });

    const [addContact] = useMutation(CREATE_CONTACT, {
        onCompleted: (result) => {
            const newContact = result.createContact;

            setData((prevData) => [...prevData, newContact]);
        },
        onError: (error) => {
            console.error("Error creating contact:", error);
        },
        update: (cache, { data: { createContact } }) => {
            // Update your cache manually if necessary
        },
    });

    useEffect(() => {
        if (fetchedData) {
            const newContacts = fetchedData.contacts;

            setData((prevData) => {
                if (currentPage === 1) return newContacts;
                return [
                    ...prevData,
                    ...newContacts.filter((contact) => {
                        return !prevData.some((existingContact) => existingContact.id === contact.id);
                    }),
                ];
            });
            totalPagesRef.current = fetchedData.pages;
            isLoadingRef.current = false;
        }
    }, [fetchedData, currentPage]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddContact = async (name, phone) => {
        try {
            // Send a mutation to create the new contact
            await addContact({ variables: { name, phone } });
        } catch (error) {
            console.error("Error creating contact:", error);
        }
    };

    const handleSearch = (keyword) => {
        setSearchKeyword(keyword); // Update the searchKeyword state
        setCurrentPage(1); // Reset the current page to 1 to start from the beginning when searching
    };

    const handleScroll = useCallback(() => {
        if (
            window.innerHeight + window.scrollY >=
            document.documentElement.scrollHeight - 200
        ) {
            // Load more data if available and not already loading
            if (currentPage < totalPagesRef.current && !isLoadingRef.current) {
                isLoadingRef.current = true;
                setCurrentPage((prevPage) => prevPage + 1);
            }
        }
    }, [currentPage, totalPagesRef, isLoadingRef, setCurrentPage]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [handleScroll]);

    return (
        <div className="container">
            <header>
                <PhoneHeader
                    handleAddContact={handleAddContact}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    handleSearch={handleSearch}
                />
            </header>
            <main className="mt-3">
                <ul>
                    {data.map((contact) => (
                        <PhoneList
                            key={contact.id}
                            id={contact.id}
                            name={contact.name}
                            phone={contact.phone}
                            avatar={contact.avatar}
                            data={data}
                            setData={setData}
                        />
                    ))}
                </ul>
                <div style={{ height: "350px" }}></div>
            </main>
        </div>
    );
}
