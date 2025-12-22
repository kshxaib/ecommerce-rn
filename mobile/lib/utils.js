export const capitalizeFirstLetter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

export const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
        case "delivered":
            return "#10B981";
        case "shipped":
            return "#3B82F6";
        case "pending":
            return "#F59E0B";
        default:
            return "#666";
    }
};