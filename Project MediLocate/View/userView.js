// // Function to render a personalized welcome message
// function renderWelcomeMessage(user) {
//     return user.medicalId
//         ? `<h1>Welcome, Dr. ${user.name}!</h1>`
//         : `<h1>Welcome, ${user.name}!</h1>`;
// }

// // Function to render a table of all users
// function renderUsers(users) {
//     let html = "<table><thead><tr><th>Name</th><th>Username</th><th>Medical ID</th></tr></thead><tbody>";
//     users.forEach(user => {
//         html += `<tr>
//                     <td>${user.name}</td>
//                     <td>${user.username}</td>
//                     <td>${user.medicalId || "N/A"}</td>
//                  </tr>`;
//     });
//     html += "</tbody></table>";
//     return html;
// }

// module.exports = { renderWelcomeMessage, renderUsers };
