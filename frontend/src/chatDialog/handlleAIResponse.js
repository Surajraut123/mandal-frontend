
export const handlleAIResponse = (action, data, dispatch, updateRequestStatus) => {
    switch(action) {
        case "ADD_CONTRIBUTION":
            dispatch(updateRequestStatus({ data: data, type: "contribution", event : "add" }));
            return `
            🙏✨ *Contribution Request Sent!* ✨🙏
            
            🙏 Donor Name: *${data.donor_name}*  
            💰 Amount Contributed: *₹${data.amount}*
            
            ${data.phone_no 
            ? `📱 A receipt will be sent shortly once the treasurer approves the request.*${data.phone_no}*` 
            : `📜 Your contribution request has been sent to the Treasurer for approval.

                You will be notified once it is approved.`}
            
            🌸 Thank you for your generous support for updating in a system.
            
            🙏 Ganapati Bappa Morya! मंगलमूर्ति मोरया! 🐘✨
                `;
        case "ADD_INVESTMENT":
            dispatch(updateRequestStatus({ data: data, type: "investment", event : "add" }));
            return `
            💼✨ *Investment Request Sent!* ✨💼
            
            🏪 Shop Name: *${data.shop_name}*  
            📌 Purpose: *${data.title}*  
            💰 Amount: *₹${data.amount}*
            ${data.description ? `📝 Description: ${data.description}` : ''}
            
            🙏 Thank you for supporting the Mandal arrangements.
            Investment towards *${data.title}* helps us make this Ganesh Utsav grand and successful.
            
            🌸Ganapati Bappa Morya! मंगलमूर्ति मोरया!🌸
                `;
        case "LIST_PENDING_CONTRIBUTION_REQUESTS":
            return `
            📋 Contribution Requests:
            
            ${data.map(req => {
            const formattedDate = new Date(req.created_at).toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });
            
            return `
            👤 Donor: ${req.donor_name}
            💰 Amount: ₹${req.amount}
            📅 Date: ${formattedDate}
            ${req.phone_no ? `📱 Phone: ${req.phone_no}` : ""}
            🔔 Status: ${req.request_status}
            `;
            }).join("\n----------------------\n")}
            `;
        case "LIST_PENDING_INVESTMENT_REQUESTS":
            return `
            📋 Investment Requests:

                ${data.map(req => {
                const formattedDate = new Date(req.created_at).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });

                return `
                🏪 Shop: ${req.shop_name}
                📌 Purpose: ${req.title}
                💰 Amount: ₹${Number(req.amount).toLocaleString("en-IN")}
                📅 Date: ${formattedDate}
                🔔 Status: ${req.request_status}
                `;
                }).join("\n----------------------\n")}
                `;
        case "LIST_MEMBERS":
            return `
            📋 Mandal Members:

            ${data.map(member => {
                const fullName = `${member.firstname} ${member.lastname}`;
                const statusText = member.status ? "Active ✅" : "Inactive ❌";

                return `
            👤 Name: ${fullName}
            📱 Phone: ${member.phone_no || "Not Available"}
            🎭 Role: ${member.roles?.role_name || "N/A"}
            🔔 Status: ${statusText}
                `;
            }).join("\n----------------------\n")}
            `;

        default:
            return data.message || 'Sorry, I did not understand that action.';
    }
}
