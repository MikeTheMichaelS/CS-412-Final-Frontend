import axios from "axios";
import { useEffect, useState } from "react";

const BACKEND_API_BASE = process.env.REACT_APP_BACKEND_API_BASE + 'api/whoami';

export default function WhoAmI() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            axios.get(BACKEND_API_BASE, { withCredentials: true, })
                .then((response) => response.data)
                .then((data) => {
                    if (data.success) {
                        setUser(data.data.username);
                    } else {
                        console.error('Failed to fetch user:', data.error);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        };
        fetchUser();
    }, []);
    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : user ? (
                <div>
                    <h1>Hello, {user}</h1>
                </div>
            ) : (
                <p>User not found</p>
            )}
        </div>
    );
}