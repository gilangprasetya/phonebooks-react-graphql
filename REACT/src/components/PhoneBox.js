import React, { useEffect, useState, useRef, useCallback } from "react";
import PhoneHeader from "./PhoneHeader";
import PhoneList from "./PhoneList";
import axios from "axios";

export default function PhoneBox() {
    const [data, setData] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const totalPagesRef = useRef(1);
    const isLoadingRef = useRef(false);
    const [searchKeyword, setSearchKeyword] = useState("");

    const fetchData = async (page, sortOrder, keyword = "") => {
        try {
            const response = await axios.get("http://localhost:3001/api/phonebooks", {
                params: { sort: sortOrder, page, keyword },
            });
            if (response.data.phonebooks) {
                // Check if it's the first page (page === 1)
                // If yes, set the data directly from the response
                // If not, append the new data only if it's not already present in the state
                setData((prevData) => {
                    if (page === 1) return response.data.phonebooks;
                    return [
                        ...prevData,
                        ...response.data.phonebooks.filter((contact) => {
                            return !prevData.some((existingContact) => existingContact.id === contact.id);
                        }),
                    ];
                });
                totalPagesRef.current = response.data.pages;
                isLoadingRef.current = false;
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData(currentPage, sortOrder, searchKeyword);
    }, [currentPage, sortOrder, searchKeyword]);

    const handleAddContact = async (name, phone) => {
        try {
            // Send a POST request to the server to create the new contact
            const response = await axios.post("http://localhost:3001/api/phonebooks", {
                name: name,
                phone: phone,
            });

            // Get the newly created contact data from the server response
            const newContact = response.data;

            // Update the data state with the new contact
            setData((prevData) => [...prevData, newContact]);
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
