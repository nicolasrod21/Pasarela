const burguerBTN = document.getElementById("burguerBtn");
const menu = document.getElementById("menuMobile");

console.log(menu);

burguerBTN.addEventListener("click", () => {
  if (menu.classList.contains("hide")) {
    menu.classList.remove("hide");
    menu.classList.add("active");
    console.log(menu);
  } else if (menu.classList.contains("active")) {
    menu.classList.remove("active");
    menu.classList.add("hide");
    console.log(menu);
  } else {
    menu.classList.add("active");
    console.log(menu);
  }
});