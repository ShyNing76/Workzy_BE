import * as services from "./services";

const response = async () => {
    try {
        const log = await services.getProfile("8639af1c-a255-4fdb-866b-294aed71bb67");
        console.log(log)
        return log
    } catch (error) {
        return error
    }
}

response()