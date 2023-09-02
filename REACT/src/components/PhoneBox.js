import React, { useEffect, useState, useRef, useCallback } from "react";
import PhoneHeader from "./PhoneHeader";
import PhoneList from "./PhoneList";
import { GET_CONTACTS, CREATE_CONTACT } from "../graphql/gql";
import { useQuery } from "@apollo/client";

export default function PhoneBox() {

    const { loading, error, data } = useQuery(GET_CONTACTS)
    const [sortOrder, setSortOrder] = useState('asc')
    
    if(loading) return 'Loading...'
    if (error) return `Error! ${error.message}`

    return (
        <div className="container">
            <header>
                <PhoneHeader
                    // handleAddContact={handleAddContact}
                    sortOrder={sortOrder}
                    setSortOrder={setSortOrder}
                    // handleSearch={handleSearch}
                />
            </header>
            <main className="mt-3">
                <ul>
                    {data.getContacts.map((contact) => (
                        <PhoneList
                            key={contact.id}
                            id={contact.id}
                            name={contact.name}
                            phone={contact.phone}
                            avatar={contact.avatar}
                            data={data}
                            // setData={setData}
                        />
                    ))}
                </ul>
                <div style={{ height: "350px" }}></div>
            </main>
        </div>
    );
}
