$(document).ready(() => {
  // Getting references to our form and inputs
  const loginForm = $("form.login");
  const emailInput = $("input#email-input");
  const passwordInput = $("input#password-input");
  const usernameInput = $("input#username-input");

  // When the form is submitted, we validate there's an email and password and username entered
  loginForm.on("submit", event => {
    event.preventDefault();
    const userData = {
      email: emailInput.val().trim(),
      password: passwordInput.val().trim(),
      username: usernameInput.val().trim()
    };

    if (!userData.email || !userData.password || !userData.username) {
      return;
    }

    // If we have an email and password and username we run the loginUser function and clear the form
    loginUser(userData.email, userData.password, userData.username);
    emailInput.val("");
    passwordInput.val("");
    usernameInput.val("");
  });

  // loginUser does a post to our "api/login" route and if successful, redirects us the the members page
  function loginUser(email, password) {
    $.post("/api/login", {
      email: email,
      password: password,
      username: username
    })
      .then(() => {
        window.location.replace("/members");
        // If there's an error, log the error
      })
      .catch(err => {
        console.log(err);
      });
  }
});
