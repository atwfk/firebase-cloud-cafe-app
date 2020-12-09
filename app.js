const cafeList = document.querySelector("#cafe-list");
const loader = document.querySelector(".loader");
const form = document.querySelector("#add-cafe-form");

//Create Element and render cafe
function renderCafe(doc) {
  if (cafeList.childNodes[1] == loader) {
    loader.remove();
  }
  let li = document.createElement("li");
  let name = document.createElement("span");
  let city = document.createElement("span");
  let cross = document.createElement("div");

  li.setAttribute("data-id", doc.id);
  name.textContent = doc.data().name;
  city.textContent = doc.data().city;
  cross.textContent = "x";

  li.appendChild(name);
  li.appendChild(city);
  li.appendChild(cross);
  cafeList.appendChild(li);

  //Deleting data
  cross.addEventListener("click", (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute("data-id");
    db.collection("cafes").doc(id).delete();
  });
}

//Saving data
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (form.name.value == "" || form.city.value == "") {
    return false;
  } else {
    db.collection("cafes").add({
      name: form.name.value,
      city: form.city.value,
    });
    form.name.value = null;
    form.city.value = null;
  }
});

//Real-time listener
db.collection("cafes")
  .orderBy("city")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == "added") {
        renderCafe(change.doc);
      } else if (change.type == "removed") {
        let li = cafeList.querySelector(`[data-id=${change.doc.id}]`);
        cafeList.removeChild(li);
      }
    });
  });

/*
//Getting data
db.collection("cafes")
  //.where("city", "==", "Cairo")
  //.orderBy("city")
  .get()
  .then((snapshot) => {
    snapshot.docs.forEach((doc) => {
      renderCafe(doc);
    });
  });
*/

/*
//Updating data in firebae
db.collection('cafes').doc(id).update({
    name: name,
    city: city,
});
*/

/*
//Updating data in firebae
db.collection('cafes').doc(id).set({
    name: name,
    city: city,
});
*/
