import React, { useState, useEffect, useRef } from "react";
import PhoneHeader from "./PhoneHeader";
import PhoneList from "./PhoneList";
import { GET_PHONEBOOKS, CREATE_PHONEBOOK } from "../graphql/gql";
import { useMutation, useQuery } from "@apollo/client";

export default function PhoneBox() {
    const limit = 13;
    const [data, setData] = useState([]);
    const [sortOrder, setSortOrder] = useState("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [loading, setLoading] = useState(false);

    const { data: queryData, refetch } = useQuery(GET_PHONEBOOKS, {
        variables: { sort: sortOrder, page: currentPage, keyword: searchKeyword, limit },
    });

    const [createPhonebook] = useMutation(CREATE_PHONEBOOK);

    useEffect(() => {
        if (queryData && queryData.getPhonebooks) {
            setData((prevData) => [...prevData, ...queryData.getPhonebooks]);
            setLoading(false);
        }
    }, [queryData]);

    const loadMoreData = () => {
        if (!loading) {
            setLoading(true);
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handleAddContact = async (name, phone) => {
        try {
            await createPhonebook({ variables: { name, phone } });
            refetch();
        } catch (error) {
            console.error("Error adding contact:", error);
        }
    };

    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);
        setCurrentPage(1);
        setData([]);
        refetch();
    };

    const observer = useRef();

    useEffect(() => {
        if (observer.current) {
            observer.current.disconnect();
        }
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMoreData();
            }
        });

        if (data.length > 0) {
            observer.current.observe(document.querySelector("#loadMoreTrigger"));
        }

        return () => {
            if (observer.current) {
                observer.current.disconnect();
            }
        };
    }, [data]);

    const handleSortClick = () => {
        const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
        setSortOrder(newSortOrder);
    };

    return (
        <div className="container">
            <header>
                <PhoneHeader
                    handleAddContact={handleAddContact}
                    sortOrder={sortOrder}
                    handleSortClick={handleSortClick}
                    handleSearch={handleSearch}
                />
            </header>
            <main className="mt-3">
                <ul>
                    {data.map((contact, index) => (
                        <PhoneList
                            key={index}
                            id={contact._id}
                            name={contact.name}
                            phone={contact.phone}
                            avatar={contact.avatar}
                            data={data}
                            setData={setData}
                        />
                    ))}
                </ul>
                <div
                    id="loadMoreTrigger"
                    style={{ height: "20px", visibility: loading ? "visible" : "hidden" }}
                ></div>
            </main>
        </div>
    );
}
