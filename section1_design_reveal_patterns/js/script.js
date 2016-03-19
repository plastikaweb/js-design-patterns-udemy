(function (win, doc, $) {
    var chatModule = (function () {
        var _leadself = 'Me: ',
          _leadcomputer = "PC: ",
          _aSaid = ['This is a Cyber Chat'],
          _msgYes = 'Yes, that is a great idea.',
          _msgNo = 'No, that must be a mistake.',
          _aSassyStuff = ['Like mold on books, grow myths on history.',
              'She moved like a poem and smiled like a sphinx.',
              'As long as we die, this is gonna be one hell of a story.',
              'She laughed, and the desert sang.',
              'You have got about as much charm as a dead slug.'];

        function _echo(msg) {
            _aSaid.push('<div>' + msg + '</div>');

            var aSaidLength = _aSaid.length,
              start = Math.max(_aSaid.length - 6, 0),
              out = '';

            for (var i = start; i < aSaidLength; i++) {
                out += _aSaid[i];
            }

            $('.advert').html(out);
            $('#talk span').text(msg);
        }

        function talk(msg) {
            _echo(_leadself + msg);
        }

        function replayYesNo() {
            var msg = Math.random() > .5 ? _msgYes : _msgNo;
            _echo(_leadcomputer + msg);
        }

        function saySassyStuff() {
            var msg = _aSassyStuff[Math.floor(Math.random() * _aSassyStuff.length)];
            _echo(_leadcomputer + msg);
        }

        return {
            talk: talk,
            replayYesNo: replayYesNo,
            saySassyStuff: saySassyStuff
        };
    })();

    $(doc).ready(function () {
        chatModule.talk('this is great');
        chatModule.replayYesNo();
        chatModule.saySassyStuff();
    });

    if(!win.chatModule) {
        win.chatModule = chatModule;
    }
})(window, document, jQuery);















