export const getUser = async (req, res) => {
    try {
        // Call the service function
        const response = null; //await services.getUser();
        return res.status(200).json(response) // use handleSuccess function to return the response
    } catch (error) {
        return res.status(500).json({error: error.message})
    }
}