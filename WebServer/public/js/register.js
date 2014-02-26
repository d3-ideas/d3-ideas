$(document).ready(function () {
    $("form").submit(function (event) {
        event.preventDefault();
        var $form = $(this),
            username = $form.find("input[name='username']").val(),
            password = $form.find("input[name='password']").val(),
            pwHash = hex_md5($form.find("input[name='password']").val()),
            confirm = $form.find("input[name='confirm']").val(),
            url = $form.attr("action"),
            posting;
        if (password !== confirm) {
            console.log('got here');
            $("#error").text("Your passwords don't match");
            return false;
        }
        posting = $.post(url, {username: username, password: pwHash});
        posting.done(function (data) {
            console.log(data);
            if (data.status === "approved") {
                window.location.assign("/Pin");
            } else if (data.status === "error") {
                $("#error").text(data.reason);
            }
            console.log(data.status);
        });
    });
});