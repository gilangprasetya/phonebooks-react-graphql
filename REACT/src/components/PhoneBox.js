import React, { useState, useEffect, refetch } from "react";
import PhoneHeader from "./PhoneHeader";
import PhoneList from "./PhoneList";
import { GET_PHONEBOOKS, CREATE_PHONEBOOK } from "../graphql/gql";
import { useMutation, useQuery } from "@apollo/client";

export default function PhoneBox() {

    const [data, setData] = useState([]);
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');

    const { loading, error, data: queryData } = useQuery(GET_PHONEBOOKS, {
        variables: { sort: sortOrder, page: currentPage, keyword: searchKeyword },
    });

    const [createPhonebook] = useMutation(CREATE_PHONEBOOK);

    useEffect(() => {
        if (queryData && queryData.getPhonebooks) {
            setData(queryData.getPhonebooks);
        }
    }, [queryData]);

    const handleAddContact = async (name, phone) => {
        try {
            await createPhonebook({ variables: { name, phone } });
            refetch();
        } catch (error) {
            console.error("Error adding contact:", error);
        }
    };

    const handleSearch = (keyword) => {
        setSearchKeyword(keyword)
        setCurrentPage(1)
    };
    if (error) return `Error! ${error.message}`;

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
                            key={contact._id}
                            id={contact._id}
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
