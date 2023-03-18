

function Logout()  {

    sessionStorage.clear();
    window.location.replace('/');


}

export default Logout;