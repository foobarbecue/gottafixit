var ddpConnection = new Asteroid("gottafix.it");
// TODO do this in a better way
// make it global so the popup can access user data...
window.ddpConnection = ddpConnection;
console.log('bg script starting');

chrome.runtime.onMessage.addListener(function (request, sender, response) {
    // this lastIndexOf thing is a startsWith implementation
    if (request.lastIndexOf('login',0) === 0) {
        ddpConnection.on("login", function loginWorked(loggedInUserId) {
            console.log('logged in as:' + loggedInUserId);
            ddpConnection.userId = loggedInUserId
        });

        ddpConnection.resumeLoginPromise.then(function alreadyLoggedIn() {
                console.log("user is already logged in")
            }
        ).fail(function notAlreadyLoggedIn() {
                ddpConnection.subscribe("meteor.loginServiceConfiguration").ready.then(function tryToLogin() {
                    console.log('trying login');
                    switch (request){
                        case 'login_facebook':
                            ddpConnection.loginWithFacebook();
                            break;
                        case 'login_github':
                            ddpConnection.loginWithGithub();
                            break;
                        case 'login_google':
                            ddpConnection.loginWithGoogle();
                            break;
                    }
                });
            })
    } else if (request === 'logout') {
        console.log('trying to logout');
        ddpConnection.logout();
    }
});

