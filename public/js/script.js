/************ 
* Function for the password button
**************/
const pswdbtn = document.querySelector("#showpwd");
pswdbtn.addEventListener("click", function() {
    const pswdInput = document.getElementById("password")
    const type = pswdInput.getAttribute("type")
    if (type=="password") {
        pswdInput.setAttribute("type", "text");
        pswdbtn.innerHTML = "Hide Password";
    } else {
        pswdInput.setAttribute("type", "password");
        pswdbtn.innerHTML = "Show Password";
    }
});