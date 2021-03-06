define([
  'jquery'
, 'underscore'
, 'backbone'
, 'sweeper/app'
, 'sweeper/views/game'
, 'sweeper/views/overlay'
], function($, _, Backbone, app, GameView, Overlay) {

  var MainView = Backbone.View.extend({
    id: 'main'
  , template: $('#tmpl-main').html()
  , initialize: function() {
      var self = this
      app.on('game:start', function(options) {
        self.startGame(options)
      }).on('game:over game:win', function() {
        self.endGame()
      })
    }
  , render: function() {
      this.$el.html(this.template)
      this.board = this.$el.find('.board')
      this.timerBox = this.$el.find('.time')
      this.minesCountBox = this.$el.find('.mines')
      this._initGame()

      return this
    }
  , _initGame: function() {
      this.gameView = new GameView()
      this.board.html(this.gameView.render().el)
      this.overlay = new Overlay()
      this.overlay.bindTo(this.gameView.$el)
      this.board.append(this.overlay.render().el)

      app.timer.on('tick', function(stopwatch) {
        this.timerBox.text(stopwatch)
      }, this)
      this.gameView.on('game:update_flags', function(flags) {
        var count = this.minesCountBox.text() | 0
        this.minesCountBox.text(count+flags)
      }, this)

      app.on('first_click', function() {
        app.timer.start()
      })
    }
  , startGame: function() {
      this.$el.width(app.config.columns * 30 + 1)
      this.gameView.start(app.config)
      this.overlay.hide()

      this.timerBox.text(0)
      this.minesCountBox.text(app.config.mines)
    }
  , endGame: function() {
      this.overlay.show()
      app.timer.stop()
    }
  })

  return MainView
})