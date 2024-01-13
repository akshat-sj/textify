$(document).ready(()=>{
    $.get("/api/posts/" + postId,results=>{
        outputposts(results,$(".postsContainer"));
    })

});
function outputposts(results, container) {
    container.html("");
    if (Array.isArray(results)) {
        results.forEach(result => {
            var html = createpostHtml(result);
            container.append(html);
        });
    } else {
        var html = createpostHtml(results);
        container.append(html);
    }
}
