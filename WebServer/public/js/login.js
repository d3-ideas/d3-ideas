$(document).ready(function () {
    $("form").submit(function (event) {
        event.preventDefault();
        var $form = $(this),
            username = $form.find("input[name='username']").val(),
            password = $form.find("input[name='password']").val(),
            url = $form.attr("action"),
            posting;

        posting = $.post(url, {username: username, password: password});
        posting.done(function (data) {
            if (data.status === "approved") {
                window.location.assign("/Pin");
            }
            else if (data.status === "error") {
                $("#error").text(data.reason);
            }
            console.log(data.status);
        });
    });
});
