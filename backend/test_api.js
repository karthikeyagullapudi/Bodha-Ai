import axios from 'axios';

const test = async () => {
    try {
        // We can't easily authenticate because of cookies, but we can look at the backend controller.
        console.log("Checking if backend is reachable...");
    } catch (e) {
        console.error(e);
    }
}
test();
