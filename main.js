setInterval(() => {
  document.querySelector('.msg-body').style.height = window.innerHeight - 110 + "px";
}, 100)

let me = '';
window.onload = function() {
  swal({
      text: 'Enter your name..',
      content: 'input',
      button: {
        text: 'Go!',
        closeModal: true
      }
    })
    .then(value => {
      me = value;
      console.log(me);
      document.querySelector('.msg-input').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
          firebase.database().ref("Chat Room/Texts").push({
            user: me,
            msg: document.querySelector('.msg-input').value.trim()
          });
          document.querySelector('.msg-input').value = '';
        }
      });
      let id = '';
      firebase.database().ref('Chat Room/Texts').on('child_added', (s) => {
        if (s.val().user === me) {
          if (id !== s.val().user)
            document.querySelector(".msg-body").innerHTML +=
            '<div class="myName">You</div><div class="msg-holder"><div class="myText" onclick="deleteMsg(\'' +
            s.key +
            "')\" id=" +
            s.key +
            " >" +
            s.val().msg +
            "</div></div>";
          else
            document.querySelector(".msg-body").innerHTML +=
            '<div class="msg-holder"><div class="myText" onclick="deleteMsg(\'' +
            s.key +
            "')\" id=" +
            s.key +
            ">" +
            s.val().msg +
            "</div></div>";
        } else {
          if (id !== s.val().user)
            document.querySelector(".msg-body").innerHTML +=
            '<div class="their-name">' +
            s.val().user +
            '</div><div class="msg-holder"><div class="thereText" id=' +
            s.key +
            ">" +
            s.val().msg +
            "</div></div>";
          else
            document.querySelector(".msg-body").innerHTML +=
            '<div class="msg-holder"><div class="thereText" id=' +
            s.key +
            ">" +
            s.val().msg +
            "</div></div>";
        }
        document.querySelector('.msg-body').scrollTo(0, 1000);
        id = s.val().user;
        firebase.database().ref('Chat Room/Texts/' + s.key)
          .on("child_changed", (a) => {
            document.querySelector('#' + s.key).innerHTML = "<i>Message deleted</i>"
          })
      })


    })
}

function deleteMsg(key) {
  console.log(key)
  swal({
    title: "Are you sure?",
    text: "You cannot recover your text once deleted.",
    icon: 'warning',
    buttons: true,
    dangerMode: true
  }).then((event) => {
    console.log(event);
    if (event) {
      firebase.database().ref('Chat Room/Texts/' + key)
        .set({ user: me, msg: '<i>Message deleted</i>' })
    }
  })
}