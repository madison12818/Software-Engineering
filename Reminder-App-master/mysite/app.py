import os
from flask import Flask, render_template, redirect, request, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import exc
from forms import LoginForm
from flask_login import current_user, login_user, UserMixin, LoginManager
import pymysql
import datetime

DTFormat = "%Y-%m-%dT%H:%M:%S.%fZ"

#from werkzeug.urls import url_parse

app = Flask(__name__)
login = LoginManager(app)

#THIS IS FOR THE NOTE_APP DB
SQLALCHEMY_DATABASE_URI = "mysql+pymysql://{username}:{password}@{hostname}/{databasename}".format(
    # local database
    # username="root",
    # password="",
    # hostname="localhost",
    # port="3306",
    # databasename="reminder_app",
    
    # db on PythonAnywhere
    username="helloworldksu",
    password="cryptonomicon",
    hostname="helloworldksu.mysql.pythonanywhere-services.com",
    databasename="helloworldksu$note_app",
)
app.config["SECRET_KEY"] = os.environ.get('SECRET_KEY', 'you-will-never-guess')
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
#END NOTE_APP DB SETUP

#db models
class User(UserMixin, db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50))
    password = db.Column(db.String(50))
    email = db.Column(db.String(50))

    def __init__(self, username_, password_, email_):
        self.id = None
        self.username = username_
        self.password = password_
        self.email = email_

class Note(db.Model):
    __tablename__ = "note"

    id = db.Column(db.Integer, primary_key=True)
    user_id  = db.Column(db.Integer)
    title = db.Column(db.String(50))
    content  = db.Column(db.String(1000))
    date_due = db.Column(db.DateTime, default = datetime.datetime.utcnow)
    date_created = db.Column(db.DateTime, default = datetime.datetime.utcnow)
    date_modified = db.Column(db.DateTime, onupdate = datetime.datetime.utcnow)
    color = db.Column(db.Integer)

    def __init__(self, user_id_, title_, content_, date_due_, color_):
        self.id = None
        self.user_id = user_id_
        self.title = title_
        self.content = content_
        self.date_due = date_due_
        self.color = color_
    
    @property
    def serialize(self):
       return {
           'id' : self.id,
           'user_id' : self.user_id,
           'title' : self.title,
           'content' : self.content,
           'date_due' : self.date_due,
           'date_created' : self.date_created,
           'date_modified' : self.date_modified,
           'color' : self.color
       }
    @property
    def serialize_many2many(self):
       return [item.serialize for item in self.many2many]

@app.route('/')
def serveIndexHtml():
    return render_template('index.html')

#route: ads
@app.route('/ads')
def route_ads():
    return render_template('ads.html')

#route: debug (both GET and POST will work)
@app.route('/debug', methods = ['GET', 'POST'])
def route_debug():
    if request.method == "POST":
        _args = request.form
    else:
        _args = request.args
    return jsonify(
        success=True,
        data="helloworld",
        method=request.method,
        arguments=_args
    )

#route: create new user
@app.route('/createNewUser', methods=['POST'])
def route_createNewUser():
    username_ = request.form['username']
    email_ = request.form['email']
    password_ = request.form['password']
    newUserAccountRecord = User(username_, password_, email_)
    db.session.add(newUserAccountRecord)
    try:
        db.session.commit()
    except exc.SQLAlchemyError as e:
        db.session().rollback()
        return jsonify(success=False)
    return _login(username_, password_)

#route: login
@app.route('/login', methods = ['POST'])
def route_login():
    username = request.form.get("username")
    password = request.form.get("password")
    return _login(username, password)

#login
def _login(username, password):
    user = User.query.filter_by(username = username).first()
    if not user or user.password != password:
        return jsonify(success=False)
    return jsonify(
        success=True,
        user_id=user.id
    )

#route: get notes
@app.route('/note')
def route_note():
    user_id = request.args.get('user_id')
    note = Note.query.filter_by(user_id = user_id)
    return jsonify(
        success=True,
        notes=[i.serialize for i in note.all()]
    )

#route: add note
@app.route('/createNote', methods = ['POST'])
def route_createNote():
    title = request.form['title']
    content = request.form['content']
    user_id = request.form['user_id']
    color = request.form['color'] if request.form['color'] else None
    newNote = Note(user_id, title, content, datetime.datetime.strptime(request.form['date_due'], DTFormat), color)
    db.session.add(newNote)
    try:
        db.session.commit()
    except exc.SQLAlchemyError as e:
        db.session().rollback()
        return jsonify(success=False)
    return jsonify(success=True)

@app.route('/deleteNote', methods = ['POST'])
def route_removeNote():
    user_id = request.form['user_id']
    note_id = request.form['note_id']
    note = Note.query.filter_by(id = note_id).delete()
    try:
        db.session.commit()
    except exc.SQLAlchemyError as e:
        db.session().rollback()
        return jsonify(success=False)
    return jsonify(success=True)

@app.route('/updateNote', methods = ['POST'])
def route_updateNote():
    noteId = request.form['note_id']
    note = Note.query.filter_by(id=noteId).first()
    note.title = request.form['title']
    note.content = request.form['content']
    note.date_due = datetime.datetime.strptime(request.form['date_due'], DTFormat)
    note.color = request.form['color'] if request.form['color'] else None
    print("[", note.color, "]")
    try:
        db.session.commit()
    except exc.SQLAlchemyError as e:
        db.session().rollback()
        return jsonify(success=False)
    return jsonify(success=True)

if __name__ == "__main__":
    app.run(use_reloader=True)
















