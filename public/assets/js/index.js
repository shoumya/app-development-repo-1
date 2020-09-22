// Your JS code goes here
/* hide the toc container */
$("#tocContainer").css("display", "none");
$("#legends").css("display", "none");
let topicsOpened = [];
/* document ready function starts here */
$(document).ready(function() {
  fetch_Toc_Content("topics");
});

/* Parse the TOC Content over here */
const parse_Toc_Content = (tocData, topicType, topicId) => {
  if (tocData && tocData.response && topicType === "topics") {
    const tocDataLen = tocData.response.length;
    let ul = $("#toc-first-level-container");
    for (let i = 0; i < tocDataLen; i++) {
      const paramId = tocData.response[i].id;
      const paramTitle = tocData.response[i].title;
      const paramChildCount = tocData.response[i].childrenCount;
      const paramCompletionCount = tocData.response[i].completeCount;
      const completionStatuscolor =
        paramCompletionCount === paramChildCount
          ? "chaptersCompleted"
          : "chaptersInProgress";
      const linkForChapter = `
      <div id="topic-${paramId}" onclick="toc_topic_Clicked('${paramTitle}','${paramId}')">
        <section class="topicsLink">
        <i class='fa fa-hand-o-right'></i>
        ${tocData.response[i].title}                     
          <span title="${completionStatuscolor.toUpperCase()}" class="${completionStatuscolor}">
          (${
            paramCompletionCount !== undefined
              ? paramCompletionCount + "/" + paramChildCount
              : 0
          })
          <i id='iconId-${paramId}' style="float:right" class='fa fa-plus-square'></i>          
        </section>       
     <div/>`;
      $("#toc-first-level-container").append(linkForChapter);
    }
    $("#tocContainer").css("display", "block");
    $(".loader").css("display", "none");
    $("#legends").css("display", "block");
  } else if (tocData && tocData.response && topicType === "chapters") {
    if (tocData.statusCode === 404) {
      $(`#topic-${topicId} > #spinnerid-${topicId}`).remove();
      $(`#topic-${topicId}`).attr("disabled", "disabled");
    } else if (tocData.response[topicId].length > 0) {
      topicsOpened.push({
        topicId: topicId,
        topicChapters: tocData.response[topicId]
      });
      /* Build the chapters Dynamic html here */
      $(`#iconId-${topicId}`).removeClass("fa fa-plus-square");
      $(`#iconId-${topicId}`).addClass("fa fa-minus-square");
      const chapterDataLen = tocData.response[topicId].length;
      const chaptersReference = tocData.response[topicId];
      const topicChapterId = `topic-chapter-${topicId}`;
      const ulElement = $(
        `<ul id=${topicChapterId} class="chaptersOpen" style='margin-top:20px;'/>`
      );
      /* Logic to build the chapters links */
      for (let tc = 0; tc < chapterDataLen; tc++) {
        const chapterTitle = chaptersReference[tc].title;
        const chapterId = chaptersReference[tc].id;
        const chapterLink = `<li class="chapterLink" id="chapter-${chapterId}">
      <i class='fa fa-file-text'></i>
      ${chaptersReference[tc].title}        
        </li>`;
        ulElement.append(chapterLink);
      }
      $("#topic-" + topicId).append(ulElement);
      $(`#topic-${topicId} > #spinnerid-${topicId}`).remove();
    }
  }
};

/* This function is called when a topic is clicked */
const toc_topic_Clicked = (title, id) => {
  let topicAlreadyOpened = false;
  for (let ctr = 0; ctr < topicsOpened.length; ctr++) {
    if (topicsOpened[ctr].topicId === id) {
      topicAlreadyOpened = true;
      topicsOpened.splice(ctr, 1);
      $("#topic-chapter-" + id).remove();
      $(`#iconId-${id}`).removeClass("fa fa-minus-square");
      $(`#iconId-${id}`).addClass("fa fa-plus-square");
      break;
    }
  }
  if (!topicAlreadyOpened) {
    /* If topic chapters not opened then open them here */
    let topicParent = $(`#topic-${id}`);
    topicParent.append(
      `<span id="spinnerid-${id}"><i class="fa fa-spinner fa-spin"/></span>`
    );
    fetch_Toc_Content("chapters", id);
  }
};
