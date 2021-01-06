const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const _ = require('lodash');
const mongoose = require('mongoose');

const app = express();

app.set('view engin', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const dbUrl = 'mongodb://localhost:27017';

mongoose.connect(`${dbUrl}/wikiDB`, { useNewUrlParser: true });

const articlelSchema = {
	title: String,
	content: String,
};

const Article = mongoose.model('Article', articlelSchema);

app
	.route('/articles')
	.get(function(req, res) {
		Article.find({}, function(err, foundArticles) {
			if (!err) {
				res.send(foundArticles);
			} else {
				res.send(err);
			}
		});
	})
	.post(function(req, res) {
		const newArticle = new Article({
			title: req.body.title,
			content: req.body.content,
		});

		newArticle.save(function(err) {
			if (!err) {
				res.send('Successfully added a new article');
			} else {
				res.send(err);
			}
		});
	})
	.delete(function(req, res) {
		Article.deleteMany(function(err) {
			if (!err) {
				res.send('Succesfully deleted all articles');
			} else {
				res.send(err);
			}
		});
	});

app
	.route('/articles/:articleTitle')
	.get(function(req, res) {
		Article.findOne({ title: _.kebabCase(req.params.articleTitle) }, function(err, foundArticle) {
			if (foundArticle) {
				res.send(foundArticle);
			} else {
				res.send('No articles matching ');
			}
		});
	})
	.put(function(req, res) {
		Article.update(
			{ title: req.params.articleTitle },
			{ title: req.body.title, content: req.body.content },
			{ overwrite: true },
			function(err) {
				if (!err) {
					res.send('Successfully Update article');
				}
			},
		);
	})
	.patch(function(req, res) {
		Article.update({ title: req.params.articleTitle }, { $set: req.body }, function(err) {
			if (!err) {
				res.send('Successfully updated article.');
			} else {
				res.send(err);
			}
		});
	})
	.delete(function(req, res) {
		Article.deleteOne({ title: req.params.articleTitle }, function(err) {
			if (!err) {
				res.send('Successfully article deleted ');
			} else {
				res.send(err);
			}
		});
	});

let port = '3000';
app.listen(port, function() {
	console.log(`Server runing on port ${port}`);
});
