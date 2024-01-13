$("#postTextarea").keyup((event) => {
    var textbox = $(event.target);
    var value = textbox.val().trim();
    console.log("Value:", value);

    var sbutton = $("#submitPostButton");
    console.log("Submit Button:", sbutton);

    if (sbutton.length == 0) {
        console.log("No submit button");
        return alert("No submit button");
    }

    if (value == ""){
        sbutton.prop("disabled", true);
        return;
    }

    sbutton.prop("disabled", false);
});
$("#submitPostButton").click((event)=>{
    var button = $(event.target);
    var textbox = $("#postTextarea");
    var data={content:textbox.val()}
    $.post("/api/posts",data,(postData)=>{
        var html = createpostHtml(postData);
        $(".postsContainer").prepend(html);
        textbox.val("");
        button.prop("disabled", true);
    })

})
$(document).on("click",".likeButton",(event)=>{
    var button = $(event.target);
    var postId = getpostIdFromElement(button);
    $.ajax({
        url: `/api/posts/${postId}/like`,
        type:"PUT",
        success:(postData)=>{
            button.find("span").text(postData.likes.length||"");
            if(postData.likes.includes(userLoggedIn._id)){
                button.addClass("active");
            }else{
                button.removeClass("active");
            }
        }
    })
})
$(document).on("click",".post",(event)=>{
    var element = $(event.target);
    var postId = getpostIdFromElement(element);
    if(postId!==undefined && !element.is("button")){
        window.location.href='/posts/' + postId;
    }
})

function getpostIdFromElement(element){
    var isroot=element.hasClass('post');
    var rootel = isroot?element:element.closest(".post");
    var postId =rootel.data().id;
    if(postId===undefined){
        return alert('underdined id')
    }
    return postId;
}

function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 30){
            return "Just now"
        }
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return + Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return + Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return + Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}


function createpostHtml(postData){
    var postedby = postData.postedby;
    var displayname = postedby.firstname + " " + postedby.lastname;
    var timestamp = timeDifference(new Date(),new Date(postData.createdAt));
    var likeButtonactive = postData.likes.includes(userLoggedIn._id)?"active":"";
    return `<div class ='post' data-id='${postData._id}'>
            <div class = 'mainContentContainer'>
                <div class = 'userImageContainer'>
                <img src = '${postedby.profilePic}'>
                </div>
                <div class = 'postContentContainer'>
                    <div class ='header'>
                        <a href='/profile/${postedby.username}' class = 'displayName'>${displayname}</a>
                        <span class ='username'>@${postedby.username}</span>
                        <span class ='timestamp'>${timestamp}</span>
                    </div>
                    <div class ='postBody'>
                        <span>${postData.content}</span>
                    </div>
                    <div class ='postFooter'>
                        <div class = 'postButtonContainer'>
                            <button>
                            <i class="far fa-comment"></i>
                            </button>
                        </div>
                        <div class = 'postButtonContainer red'>
                            <button class="likeButton ${likeButtonactive}">
                            <i class="far fa-heart"></i>
                            <span>${postData.likes.length||""}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    </div>`;
}