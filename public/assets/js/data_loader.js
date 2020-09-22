// Fetch the json data here
const fetch_Toc_Content = (topics, id) => {
  let url =
    topics === "chapters" ? toc_Data_Url + "/section/" + id : toc_Data_Url;
  fetch(url, {
    method: "GET",
    params: {},
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(response => {
      if (topics === "topics") {
        parse_Toc_Content(response, "topics");
      } else if (topics === "chapters") {
        parse_Toc_Content(response, "chapters", id);
      }
    })
    .catch(error => console.error("Error:", error));
};
