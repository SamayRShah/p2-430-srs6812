# Project 2

## What is the intended purpose of your application?
To make an IO game.

## How are you using React?
I am using React for:
- UI
- Different pages
- State management

## What components have you made?
- **Form input component**
- **Resizing Game canvas**
- **Toasts** – (error/success popup messages)
- **ConnectionBox** – styled component for connecting to the game and setting a nickname. It also holds a default value of username if a user is logged in.
- **UserBox** – styled component that:
  - Shows buttons to go to the settings page and log out if the user is logged in.
  - Displays "Hello guest" with login and signup buttons if the user is not logged in.
- **LoginPage** – switches between login and signup forms and includes login input fields.
- **Leaderboard** – div that shows the leaderboard, rearranges itself, and updates with players.
- **GameOver** – screen that redirects to the home page.
- **Settings Page** – similar to ConnectionBox, with an input to change the password.

## What data are you storing in MongoDB?
- Username/password

## What went right/wrong
- **What went right:**
  - I got a basic IO game working.
- **What went wrong:**
  - I ran out of time and couldn’t implement everything I wanted to.
  - Spent too much time integrating and perfecting different parts instead of focusing on core functionality.
  - Overcomplicated aspects which broke core functionality, requiring more time to fix rather than making progress.

## If you were to continue, what would you do to improve your application?
- Implement the profit model:
  - User settings (e.g., default nickname, player skins, etc.)
  - User purchases (e.g., different skins/premium mode)
  - Ads and in-game cosmetics
    - Use Google Ad Service
    - Create a premium mode switch to block ad elements
    - Develop skins that can be purchased
- Add features:
  - Reconnect to the game when the server times out or after death.
  - Gradient background to indicate movement.
  - Mobile support.
- Finish commenting and documenting.

## If you used any borrowed code or code fragments, where did you get them from?
- No specific fragments, but used the following blog for reference:
  - [https://victorzhou.com/blog/build-an-io-game-part-1/](https://victorzhou.com/blog/build-an-io-game-part-1/)

## Endpoints

### URL: `/login`
**Supported Methods:**
- `GET`
- `POST`

**Middleware:**
- `GET`: Requires Secure, Requires Logout
- `POST`: Requires Secure, Requires Logout

**Query/Body Parameters:**
- `POST`:
  - `username` (string, required): The username of the user.
  - `pass` (string, required): The password of the user.

**Description:**
- `GET`: Renders the login page.
- `POST`: Authenticates the user and starts a session if the credentials are valid.

**Return Types:**
- `GET`: HTML (Rendered login page).
- `POST`: JSON
  - `{ account: <userObject> }` if successful.
  - `{ error: <errorMessage> }` if an error occurs.

### URL: `/signup`
**Supported Methods:**
- `GET`
- `POST`

**Middleware:**
- `GET`: Requires Secure, Requires Logout
- `POST`: Requires Secure, Requires Logout

**Query/Body Parameters:**
- `POST`:
  - `username` (string, required): The username to register.
  - `pass` (string, required): The password for the account.
  - `pass2` (string, required): Confirmation of the password.

**Description:**
- `GET`: Renders the signup page.
- `POST`: Creates a new user account if the data is valid.

**Return Types:**
- `GET`: HTML (Rendered signup page).
- `POST`: JSON
  - `{ account: <userObject> }` if successful.
  - `{ error: <errorMessage> }` if an error occurs.

### URL: `/logout`
**Supported Methods:**
- `GET`

**Middleware:**
- Requires Secure, Requires Login

**Description:**
- Logs the user out, destroys their session, and redirects to the homepage.

**Return Types:**
- Redirect to `/`.

### URL: `/settings`
**Supported Methods:**
- `GET`

**Middleware:**
- Requires Secure, Requires Login

**Description:**
- Renders the settings page for the user.

**Return Types:**
- HTML (Rendered settings page).

### URL: `/session`
**Supported Methods:**
- `GET`

**Middleware:**
- None

**Description:**
- Retrieves the current session user information for the logged-in user.

**Return Types:**
- JSON
  - `{ account: <userObject> }` if a user is logged in.
  - `null` if the user isn’t logged in.

### URL: `/`
**Supported Methods:**
- `GET`

**Middleware:**
- Requires Secure

**Description:**
- Renders the main game page.

**Return Types:**
- HTML (Rendered main game page).

### URL: `/connect-game`
**Supported Methods:**
- `POST`

**Middleware:**
- Requires Secure

**Body Parameters:**
- `nickname` (string, required): The nickname the player wants to use.

**Description:**
- Validates the provided nickname and returns it if valid.

**Return Types:**
- JSON
  - `{ nickname: <nickname> }` if successful.
  - `{ error: <errorMessage> }` if an error occurs.

### URL: `/*`
**Supported Methods:**
- `GET`

**Middleware:**
- None

**Description:**
- A catch-all route that redirects any unrecognized paths to `/`.

**Return Types:**
- Redirect to `/`.

### URL: `/change-password`
**Supported Methods:**
- `POST`

**Middleware:**
- Requires Secure
- Requires Login

**Body Parameters:**
- `newPass` (string, required): The new password to set for the account.

**Description:**
- Allows the logged-in user to change their account password.

**Return Types:**
- JSON
  - `{ message: "Password successfully updated!" }` if successful.
  - `{ error: <errorMessage> }` if an error occurs.
