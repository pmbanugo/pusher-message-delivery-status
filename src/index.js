$(document).ready(function(){
    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    var pusher = new Pusher('Enter your app key here', {
        cluster: 'eu',
        encrypted: false
    });

    var channel = pusher.subscribe('private-channel');//channel name prefixed with 'private' because it'll be a private channel

    channel.bind('client-message-added', onMessageAdded);
    channel.bind('client-message-delivered', onMessageDelivered);

    $('#btn-chat').click(function(){
        const id = generateId();
        const message = $("#message").val();
        $("#message").val("");
        
        let template = $("#new-message-me").html();
        template = template.replace("{{id}}", id);
        template = template.replace("{{body}}", message);
        template = template.replace("{{status}}", "");

        $(".chat").append(template);

        //send message
        channel.trigger("client-message-added", { id, message });
    });

    function generateId() {
        return Math.round(new Date().getTime() + (Math.random() * 100));
    }

    function onMessageAdded(data) {
        let template = $("#new-message-other").html();
        template = template.replace("{{body}}", data.message);

        $(".chat").append(template);

        //notify sender
        channel.trigger("client-message-delivered", { id: data.id });
    }
    
    function onMessageDelivered(data) {
        $("#" + data.id).find("small").html("Delivered");
    }
});
