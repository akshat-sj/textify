$(document).ready(()=>{
    $.get("/api/posts",results=>{
        outputposts(results,$(".postsContainer"));
    })

});
function outputposts(results,container){
    container.html("");
    results.forEach(result => {
        var html = createpostHtml(result);
        container.append(html);
    });
}

