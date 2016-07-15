var assert = require('assert');
var express = require('express');
var superagent = require('superagent');
var wagner = require('wagner-core');

var URL_ROOT = 'http://localhost:3000';

describe('Topic API', function() {
  var server;
  var Topic;
  var Category;

  before(function() {
    var app = express();

    // Bootstrap server
    models = require('../models/models')(wagner);
    app.use(require('../routes/topic-api')(wagner));
    wagner.invoke(require('../auth'), { app: app });

    server = app.listen(3000);

    // Make Topic and Category model available in tests
    Topic = models.Topic;
    Category = models.Category;
  });

  after(function() {
    // Shut the server down when we're done
    server.close();
  });

  beforeEach(function(done) {
    // Make sure categories are empty before each test
    Category.remove({}, function(error) {
      assert.ifError(error);
      Topic.remove({}, function(error) {
        assert.ifError(error);
        done();
      });
    });
  });

  it('can load a topic by id', function(done) {
    // Create a single topic
    var topic = {
      // _id: 'abcxyz',
      title: 'The Alpha-Beta',
      short_desc: 'The Alpha-Beta',
      description: 'Alpha-Beta',
      category: 'Electronics',
      disp_order: 1
    }
    Topic.create(topic, function(error, topic) {
      assert.ifError(error);
      var url = URL_ROOT + '/id/' + topic._id;
      // Make an HTTP request to localhost:3000/topic/id/Electronics
      superagent.get(url)
      .set('Authorization', 'Bearer suMwoiihHZkYuYq')
      .end(function(error, res) {
        assert.ifError(error);
        var result;
        // And make sure we got { _id: 'Electronics' } back
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result);
        assert.equal(result._id, topic._id);
        assert.equal(result.title, 'The Alpha-Beta');
        assert.equal(result.category, 'Electronics');
        done();
      });
    });
  });

  it('can load all topic', function(done) {
    // Create a single topic
    var topics = [
      {
        title: 'The Alpha-Beta',
        short_desc: 'The Alpha-Beta',
        description: 'Alpha-Beta',
        category: 'Electronics',
        disp_order: 1
      },
      {
        title: 'Apple',
        short_desc: 'The Apple',
        description: 'The Apple, mackook, ipad, iphone, Apple watch',
        category: 'Devices',
        disp_order: 10
      }
    ];

    Topic.create(topics, function(error, doc) {
      assert.ifError(error);
      var url = URL_ROOT + '/list';
      // Make an HTTP request to localhost:3000/topic/id/Electronics
      superagent.get(url)
      .set('Authorization', 'Bearer suMwoiihHZkYuYq')
      .end(function(error, res) {
        assert.ifError(error);
        var result;
        // And make sure we got { _id: 'Electronics' } back
        assert.doesNotThrow(function() {
          result = JSON.parse(res.text);
        });
        assert.ok(result);
        assert.equal(result.topics.length, 2);
        assert.equal(result.topics[0]._id, doc[0]._id);
        assert.equal(result.topics[0].title, 'The Alpha-Beta');
        assert.equal(result.topics[0].category, 'Electronics');
        assert.equal(result.topics[1]._id, doc[1]._id);
        assert.equal(result.topics[1].title, 'Apple');
        assert.equal(result.topics[1].category, 'Devices');
        done();
      });
    });
  });

  it('can load list of topic by category', function(done) {

    var category = new Category({
      _id: 'abcxyz',
      name: 'Electronics',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAABEFJREFUSA2VVntom1UUP+d8SdqknbOCdTihItXVCHajom7aNS1SmvSxppghKtI/3ARBBUEU1G1/+CpswtwEkSGD4YPGJq1tk1U306abYFnRPRRRmFCcsy20Vlr7+r57PHftl6ZtsswD+e695/zO79zHuecG4X/K9tDJW/IsVaOAy1HBXUjwGwP1DkTqzgEgr6XDtYrsY8aqYPxZAG4RTDsT/ugi5+UFa6GcGHYrxlJCfKs/6j+TznHDAXzNPQcV0dVkJHAoncDu+/2xvBk3fyrjD5KR+qStJ7tzvbaqpTuo7dnItS0eD8wXzOJTqPhVX6h3k9ZpyRkgFGo3gI0X3fP0+pJL5m9FY7dHBxHCfWxy2NeayL+hAGMLnh2IPKCdM1MvaQsdxue6l+hsGJbD3sBTs/HqYHd5zhUAURmDOn89cm2zHNYLaZiLaNEeBfRZ7gCsJPfQSnPO2D0TbhxJGRBMNqy3gfmwI6XM1kH8XZZ8fzZzRj3DZlZ8INnV8F3OFeBGzyCw8mckyqCsaektEfWoJtfmnAH6j1fPAVK8Khjbk4FvnWphnv+RFd9RuSvmvRbAF0oU1oS6N69Dpilown1YbvArukykqTN2jTx4mhS/RsRHa2v7CuT6xyKAMC4HslUiXxGviwDqEiMJBrYx8DY55UlZxdH0MrAj2FfsmnRN9PdXm+mRKkOxW3GBNxFBCTBsdTCDJxkNPKcv1FXlKTEs2iIbVyqkc4yqD0ETB/6wSTQBmdwGaBZBkTUl+lbbptvBcGB8Z3Pv84DYJ5OrdADx9KP1PUXhcMOk2C8v/zQ2JXoblTVbj6wex0W2kPBIIhI4WxXs7XjIH7vp+3hA9n1FkNQFxYYXEeYdUnI7yIVPivnDFQiAryX2sMygSS+TzdkpyaRTprJeOvvVrj9XcHjJ7eF7ZCylekWEU7aUS0GiOKaLb/uyYHz0G6mGx+xysDPYcy8z75da/yZMePat3WebSkoIowmGPbZbBuNBInVeWVhLwx8/sGgwHJnNF7JlyZ9xyq3EfCla7mzk20PtbsXw2Jxr5oLtp1tdtmX2dWDi30z8S+o98AVjx5HxRKLTf1oDH2nq2uAkY79k092g4FixazoWDu++VjLEdrtBzk/k/N5Jr/3a775Qu2vjotPrRNe7rBx7UwF0uS10UJTIeDnRUfeTBmvxNZ0sBbKekMy6UwHcLNllAeOozP6jwa7Az0uo1V85/Pcl9X8YiNSfSAXQkOUU/EJ2ti3ZGfh6tVvuUcXec87CsbFDkt5XktGGNu2xKoBW6Ns3V7j4nmxXgWmZb6zOGo1YL5q4YOyvZyQtWwnwYCJa32Wj1gWwDdXNPRUK8YD8TSgS0BACD5kEQy5Gi5HLLAvLZHplYtsiGLkHHJ2Rl2y4u/Ffm0O3WQPYIH2gTqfhlWfBK2CvkBlyS0eY1YjMeMQw+Ndvw426xGSU/wD0GLwZJKDB0QAAAABJRU5ErkJggg==',
      description: 'Talking about all the electricity devices.',
      level: 'N1',
      topic_count: 5,
      disp_order: 2
    });


    category.save(function(error) {
      assert.ifError(error);

      var topics = [
        {
          title: 'Alpha-Beta is for Google',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAABEFJREFUSA2VVntom1UUP+d8SdqknbOCdTihItXVCHajom7aNS1SmvSxppghKtI/3ARBBUEU1G1/+CpswtwEkSGD4YPGJq1tk1U306abYFnRPRRRmFCcsy20Vlr7+r57PHftl6ZtsswD+e695/zO79zHuecG4X/K9tDJW/IsVaOAy1HBXUjwGwP1DkTqzgEgr6XDtYrsY8aqYPxZAG4RTDsT/ugi5+UFa6GcGHYrxlJCfKs/6j+TznHDAXzNPQcV0dVkJHAoncDu+/2xvBk3fyrjD5KR+qStJ7tzvbaqpTuo7dnItS0eD8wXzOJTqPhVX6h3k9ZpyRkgFGo3gI0X3fP0+pJL5m9FY7dHBxHCfWxy2NeayL+hAGMLnh2IPKCdM1MvaQsdxue6l+hsGJbD3sBTs/HqYHd5zhUAURmDOn89cm2zHNYLaZiLaNEeBfRZ7gCsJPfQSnPO2D0TbhxJGRBMNqy3gfmwI6XM1kH8XZZ8fzZzRj3DZlZ8INnV8F3OFeBGzyCw8mckyqCsaektEfWoJtfmnAH6j1fPAVK8Khjbk4FvnWphnv+RFd9RuSvmvRbAF0oU1oS6N69Dpilown1YbvArukykqTN2jTx4mhS/RsRHa2v7CuT6xyKAMC4HslUiXxGviwDqEiMJBrYx8DY55UlZxdH0MrAj2FfsmnRN9PdXm+mRKkOxW3GBNxFBCTBsdTCDJxkNPKcv1FXlKTEs2iIbVyqkc4yqD0ETB/6wSTQBmdwGaBZBkTUl+lbbptvBcGB8Z3Pv84DYJ5OrdADx9KP1PUXhcMOk2C8v/zQ2JXoblTVbj6wex0W2kPBIIhI4WxXs7XjIH7vp+3hA9n1FkNQFxYYXEeYdUnI7yIVPivnDFQiAryX2sMygSS+TzdkpyaRTprJeOvvVrj9XcHjJ7eF7ZCylekWEU7aUS0GiOKaLb/uyYHz0G6mGx+xysDPYcy8z75da/yZMePat3WebSkoIowmGPbZbBuNBInVeWVhLwx8/sGgwHJnNF7JlyZ9xyq3EfCla7mzk20PtbsXw2Jxr5oLtp1tdtmX2dWDi30z8S+o98AVjx5HxRKLTf1oDH2nq2uAkY79k092g4FixazoWDu++VjLEdrtBzk/k/N5Jr/3a775Qu2vjotPrRNe7rBx7UwF0uS10UJTIeDnRUfeTBmvxNZ0sBbKekMy6UwHcLNllAeOozP6jwa7Az0uo1V85/Pcl9X8YiNSfSAXQkOUU/EJ2ti3ZGfh6tVvuUcXec87CsbFDkt5XktGGNu2xKoBW6Ns3V7j4nmxXgWmZb6zOGo1YL5q4YOyvZyQtWwnwYCJa32Wj1gWwDdXNPRUK8YD8TSgS0BACD5kEQy5Gi5HLLAvLZHplYtsiGLkHHJ2Rl2y4u/Ffm0O3WQPYIH2gTqfhlWfBK2CvkBlyS0eY1YjMeMQw+Ndvw426xGSU/wD0GLwZJKDB0QAAAABJRU5ErkJggg==',
          short_desc: 'As Sergey and I wrote in the original founders letter 11 years ago',
          description: 'We did a lot of things that seemed crazy at the time. Many of those crazy things.',
          category: category._id,
          disp_order: 4
        },
        {
          title: 'Apple mackook',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAABEFJREFUSA2VVntom1UUP+d8SdqknbOCdTihItXVCHajom7aNS1SmvSxppghKtI/3ARBBUEU1G1/+CpswtwEkSGD4YPGJq1tk1U306abYFnRPRRRmFCcsy20Vlr7+r57PHftl6ZtsswD+e695/zO79zHuecG4X/K9tDJW/IsVaOAy1HBXUjwGwP1DkTqzgEgr6XDtYrsY8aqYPxZAG4RTDsT/ugi5+UFa6GcGHYrxlJCfKs/6j+TznHDAXzNPQcV0dVkJHAoncDu+/2xvBk3fyrjD5KR+qStJ7tzvbaqpTuo7dnItS0eD8wXzOJTqPhVX6h3k9ZpyRkgFGo3gI0X3fP0+pJL5m9FY7dHBxHCfWxy2NeayL+hAGMLnh2IPKCdM1MvaQsdxue6l+hsGJbD3sBTs/HqYHd5zhUAURmDOn89cm2zHNYLaZiLaNEeBfRZ7gCsJPfQSnPO2D0TbhxJGRBMNqy3gfmwI6XM1kH8XZZ8fzZzRj3DZlZ8INnV8F3OFeBGzyCw8mckyqCsaektEfWoJtfmnAH6j1fPAVK8Khjbk4FvnWphnv+RFd9RuSvmvRbAF0oU1oS6N69Dpilown1YbvArukykqTN2jTx4mhS/RsRHa2v7CuT6xyKAMC4HslUiXxGviwDqEiMJBrYx8DY55UlZxdH0MrAj2FfsmnRN9PdXm+mRKkOxW3GBNxFBCTBsdTCDJxkNPKcv1FXlKTEs2iIbVyqkc4yqD0ETB/6wSTQBmdwGaBZBkTUl+lbbptvBcGB8Z3Pv84DYJ5OrdADx9KP1PUXhcMOk2C8v/zQ2JXoblTVbj6wex0W2kPBIIhI4WxXs7XjIH7vp+3hA9n1FkNQFxYYXEeYdUnI7yIVPivnDFQiAryX2sMygSS+TzdkpyaRTprJeOvvVrj9XcHjJ7eF7ZCylekWEU7aUS0GiOKaLb/uyYHz0G6mGx+xysDPYcy8z75da/yZMePat3WebSkoIowmGPbZbBuNBInVeWVhLwx8/sGgwHJnNF7JlyZ9xyq3EfCla7mzk20PtbsXw2Jxr5oLtp1tdtmX2dWDi30z8S+o98AVjx5HxRKLTf1oDH2nq2uAkY79k092g4FixazoWDu++VjLEdrtBzk/k/N5Jr/3a775Qu2vjotPrRNe7rBx7UwF0uS10UJTIeDnRUfeTBmvxNZ0sBbKekMy6UwHcLNllAeOozP6jwa7Az0uo1V85/Pcl9X8YiNSfSAXQkOUU/EJ2ti3ZGfh6tVvuUcXec87CsbFDkt5XktGGNu2xKoBW6Ns3V7j4nmxXgWmZb6zOGo1YL5q4YOyvZyQtWwnwYCJa32Wj1gWwDdXNPRUK8YD8TSgS0BACD5kEQy5Gi5HLLAvLZHplYtsiGLkHHJ2Rl2y4u/Ffm0O3WQPYIH2gTqfhlWfBK2CvkBlyS0eY1YjMeMQw+Ndvw426xGSU/wD0GLwZJKDB0QAAAABJRU5ErkJggg==',
          short_desc: 'mackook product',
          description: 'design by Apple',
          category: category._id,
          disp_order: 5
        }
      ];

      Topic.create(topics, function(error, topics) {
        assert.ifError(error);
        var now = new Date();
        // five minutes ago
        var date = new Date(now.getTime() - 5*60*1000);
        var url = URL_ROOT + '/list/abcxyz/' + date.getTime();
        // Make an HTTP request to localhost:3000/topic/list/abcxyz/:date
        var agent = superagent.agent();
        agent.get(url)
        .set('Authorization', 'Bearer suMwoiihHZkYuYq')
        .end(function(error, res) {
          assert.ifError(error);
          var result;
          assert.doesNotThrow(function() {
            result = JSON.parse(res.text);
          });
          assert.ok(result);
          assert.equal(result.length, 2);
          assert.equal(result[0].title, 'Alpha-Beta is for Google');
          assert.equal(result[0].category, 'abcxyz');
          assert.equal(result[1].title, 'Apple mackook');
          assert.equal(result[0].category, 'abcxyz');
          done();
        });
      });
    });
  });

  it('no topics return', function(done) {

    var category = new Category({
      _id: 'abcxyz',
      name: 'Electronics',
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAABEFJREFUSA2VVntom1UUP+d8SdqknbOCdTihItXVCHajom7aNS1SmvSxppghKtI/3ARBBUEU1G1/+CpswtwEkSGD4YPGJq1tk1U306abYFnRPRRRmFCcsy20Vlr7+r57PHftl6ZtsswD+e695/zO79zHuecG4X/K9tDJW/IsVaOAy1HBXUjwGwP1DkTqzgEgr6XDtYrsY8aqYPxZAG4RTDsT/ugi5+UFa6GcGHYrxlJCfKs/6j+TznHDAXzNPQcV0dVkJHAoncDu+/2xvBk3fyrjD5KR+qStJ7tzvbaqpTuo7dnItS0eD8wXzOJTqPhVX6h3k9ZpyRkgFGo3gI0X3fP0+pJL5m9FY7dHBxHCfWxy2NeayL+hAGMLnh2IPKCdM1MvaQsdxue6l+hsGJbD3sBTs/HqYHd5zhUAURmDOn89cm2zHNYLaZiLaNEeBfRZ7gCsJPfQSnPO2D0TbhxJGRBMNqy3gfmwI6XM1kH8XZZ8fzZzRj3DZlZ8INnV8F3OFeBGzyCw8mckyqCsaektEfWoJtfmnAH6j1fPAVK8Khjbk4FvnWphnv+RFd9RuSvmvRbAF0oU1oS6N69Dpilown1YbvArukykqTN2jTx4mhS/RsRHa2v7CuT6xyKAMC4HslUiXxGviwDqEiMJBrYx8DY55UlZxdH0MrAj2FfsmnRN9PdXm+mRKkOxW3GBNxFBCTBsdTCDJxkNPKcv1FXlKTEs2iIbVyqkc4yqD0ETB/6wSTQBmdwGaBZBkTUl+lbbptvBcGB8Z3Pv84DYJ5OrdADx9KP1PUXhcMOk2C8v/zQ2JXoblTVbj6wex0W2kPBIIhI4WxXs7XjIH7vp+3hA9n1FkNQFxYYXEeYdUnI7yIVPivnDFQiAryX2sMygSS+TzdkpyaRTprJeOvvVrj9XcHjJ7eF7ZCylekWEU7aUS0GiOKaLb/uyYHz0G6mGx+xysDPYcy8z75da/yZMePat3WebSkoIowmGPbZbBuNBInVeWVhLwx8/sGgwHJnNF7JlyZ9xyq3EfCla7mzk20PtbsXw2Jxr5oLtp1tdtmX2dWDi30z8S+o98AVjx5HxRKLTf1oDH2nq2uAkY79k092g4FixazoWDu++VjLEdrtBzk/k/N5Jr/3a775Qu2vjotPrRNe7rBx7UwF0uS10UJTIeDnRUfeTBmvxNZ0sBbKekMy6UwHcLNllAeOozP6jwa7Az0uo1V85/Pcl9X8YiNSfSAXQkOUU/EJ2ti3ZGfh6tVvuUcXec87CsbFDkt5XktGGNu2xKoBW6Ns3V7j4nmxXgWmZb6zOGo1YL5q4YOyvZyQtWwnwYCJa32Wj1gWwDdXNPRUK8YD8TSgS0BACD5kEQy5Gi5HLLAvLZHplYtsiGLkHHJ2Rl2y4u/Ffm0O3WQPYIH2gTqfhlWfBK2CvkBlyS0eY1YjMeMQw+Ndvw426xGSU/wD0GLwZJKDB0QAAAABJRU5ErkJggg==',
      description: 'Talking about all the electricity devices.',
      level: 'N1',
      topic_count: 5,
      disp_order: 2
    });


    category.save(function(error) {
      assert.ifError(error);

      var topics = [
        {
          // _id: 'google',
          title: 'Alpha-Beta is for Google',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAABEFJREFUSA2VVntom1UUP+d8SdqknbOCdTihItXVCHajom7aNS1SmvSxppghKtI/3ARBBUEU1G1/+CpswtwEkSGD4YPGJq1tk1U306abYFnRPRRRmFCcsy20Vlr7+r57PHftl6ZtsswD+e695/zO79zHuecG4X/K9tDJW/IsVaOAy1HBXUjwGwP1DkTqzgEgr6XDtYrsY8aqYPxZAG4RTDsT/ugi5+UFa6GcGHYrxlJCfKs/6j+TznHDAXzNPQcV0dVkJHAoncDu+/2xvBk3fyrjD5KR+qStJ7tzvbaqpTuo7dnItS0eD8wXzOJTqPhVX6h3k9ZpyRkgFGo3gI0X3fP0+pJL5m9FY7dHBxHCfWxy2NeayL+hAGMLnh2IPKCdM1MvaQsdxue6l+hsGJbD3sBTs/HqYHd5zhUAURmDOn89cm2zHNYLaZiLaNEeBfRZ7gCsJPfQSnPO2D0TbhxJGRBMNqy3gfmwI6XM1kH8XZZ8fzZzRj3DZlZ8INnV8F3OFeBGzyCw8mckyqCsaektEfWoJtfmnAH6j1fPAVK8Khjbk4FvnWphnv+RFd9RuSvmvRbAF0oU1oS6N69Dpilown1YbvArukykqTN2jTx4mhS/RsRHa2v7CuT6xyKAMC4HslUiXxGviwDqEiMJBrYx8DY55UlZxdH0MrAj2FfsmnRN9PdXm+mRKkOxW3GBNxFBCTBsdTCDJxkNPKcv1FXlKTEs2iIbVyqkc4yqD0ETB/6wSTQBmdwGaBZBkTUl+lbbptvBcGB8Z3Pv84DYJ5OrdADx9KP1PUXhcMOk2C8v/zQ2JXoblTVbj6wex0W2kPBIIhI4WxXs7XjIH7vp+3hA9n1FkNQFxYYXEeYdUnI7yIVPivnDFQiAryX2sMygSS+TzdkpyaRTprJeOvvVrj9XcHjJ7eF7ZCylekWEU7aUS0GiOKaLb/uyYHz0G6mGx+xysDPYcy8z75da/yZMePat3WebSkoIowmGPbZbBuNBInVeWVhLwx8/sGgwHJnNF7JlyZ9xyq3EfCla7mzk20PtbsXw2Jxr5oLtp1tdtmX2dWDi30z8S+o98AVjx5HxRKLTf1oDH2nq2uAkY79k092g4FixazoWDu++VjLEdrtBzk/k/N5Jr/3a775Qu2vjotPrRNe7rBx7UwF0uS10UJTIeDnRUfeTBmvxNZ0sBbKekMy6UwHcLNllAeOozP6jwa7Az0uo1V85/Pcl9X8YiNSfSAXQkOUU/EJ2ti3ZGfh6tVvuUcXec87CsbFDkt5XktGGNu2xKoBW6Ns3V7j4nmxXgWmZb6zOGo1YL5q4YOyvZyQtWwnwYCJa32Wj1gWwDdXNPRUK8YD8TSgS0BACD5kEQy5Gi5HLLAvLZHplYtsiGLkHHJ2Rl2y4u/Ffm0O3WQPYIH2gTqfhlWfBK2CvkBlyS0eY1YjMeMQw+Ndvw426xGSU/wD0GLwZJKDB0QAAAABJRU5ErkJggg==',
          short_desc: 'As Sergey and I wrote in the original founders letter 11 years ago',
          description: 'We did a lot of things that seemed crazy at the time. Many of those crazy things.',
          category: 'abcxyz',
          disp_order: 4
        },
        {
          // _id: 'apple',
          title: 'Apple mackook',
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAABEFJREFUSA2VVntom1UUP+d8SdqknbOCdTihItXVCHajom7aNS1SmvSxppghKtI/3ARBBUEU1G1/+CpswtwEkSGD4YPGJq1tk1U306abYFnRPRRRmFCcsy20Vlr7+r57PHftl6ZtsswD+e695/zO79zHuecG4X/K9tDJW/IsVaOAy1HBXUjwGwP1DkTqzgEgr6XDtYrsY8aqYPxZAG4RTDsT/ugi5+UFa6GcGHYrxlJCfKs/6j+TznHDAXzNPQcV0dVkJHAoncDu+/2xvBk3fyrjD5KR+qStJ7tzvbaqpTuo7dnItS0eD8wXzOJTqPhVX6h3k9ZpyRkgFGo3gI0X3fP0+pJL5m9FY7dHBxHCfWxy2NeayL+hAGMLnh2IPKCdM1MvaQsdxue6l+hsGJbD3sBTs/HqYHd5zhUAURmDOn89cm2zHNYLaZiLaNEeBfRZ7gCsJPfQSnPO2D0TbhxJGRBMNqy3gfmwI6XM1kH8XZZ8fzZzRj3DZlZ8INnV8F3OFeBGzyCw8mckyqCsaektEfWoJtfmnAH6j1fPAVK8Khjbk4FvnWphnv+RFd9RuSvmvRbAF0oU1oS6N69Dpilown1YbvArukykqTN2jTx4mhS/RsRHa2v7CuT6xyKAMC4HslUiXxGviwDqEiMJBrYx8DY55UlZxdH0MrAj2FfsmnRN9PdXm+mRKkOxW3GBNxFBCTBsdTCDJxkNPKcv1FXlKTEs2iIbVyqkc4yqD0ETB/6wSTQBmdwGaBZBkTUl+lbbptvBcGB8Z3Pv84DYJ5OrdADx9KP1PUXhcMOk2C8v/zQ2JXoblTVbj6wex0W2kPBIIhI4WxXs7XjIH7vp+3hA9n1FkNQFxYYXEeYdUnI7yIVPivnDFQiAryX2sMygSS+TzdkpyaRTprJeOvvVrj9XcHjJ7eF7ZCylekWEU7aUS0GiOKaLb/uyYHz0G6mGx+xysDPYcy8z75da/yZMePat3WebSkoIowmGPbZbBuNBInVeWVhLwx8/sGgwHJnNF7JlyZ9xyq3EfCla7mzk20PtbsXw2Jxr5oLtp1tdtmX2dWDi30z8S+o98AVjx5HxRKLTf1oDH2nq2uAkY79k092g4FixazoWDu++VjLEdrtBzk/k/N5Jr/3a775Qu2vjotPrRNe7rBx7UwF0uS10UJTIeDnRUfeTBmvxNZ0sBbKekMy6UwHcLNllAeOozP6jwa7Az0uo1V85/Pcl9X8YiNSfSAXQkOUU/EJ2ti3ZGfh6tVvuUcXec87CsbFDkt5XktGGNu2xKoBW6Ns3V7j4nmxXgWmZb6zOGo1YL5q4YOyvZyQtWwnwYCJa32Wj1gWwDdXNPRUK8YD8TSgS0BACD5kEQy5Gi5HLLAvLZHplYtsiGLkHHJ2Rl2y4u/Ffm0O3WQPYIH2gTqfhlWfBK2CvkBlyS0eY1YjMeMQw+Ndvw426xGSU/wD0GLwZJKDB0QAAAABJRU5ErkJggg==',
          short_desc: 'mackook product',
          description: 'design by Apple',
          category: 'abcxyz',
          disp_order: 5
        }
      ];

      Topic.create(topics, function(error, topics) {
        assert.ifError(error);
        var now = new Date();
        // five minutes ago
        var date = new Date(now.getTime() + 5*60*1000);
        var url = URL_ROOT + '/list/abcxyz/' + date.getTime();
        // Make an HTTP request to localhost:3000/topic/list/abcxyz/:date
        superagent.get(url)
        .set('Authorization', 'Bearer suMwoiihHZkYuYq')
        .end(function(error, res) {
          assert.ifError(error);
          var result;
          assert.doesNotThrow(function() {
            result = JSON.parse(res.text);
          });
          assert.ok(result);
          assert.equal(result.length, 0);
          done();
        });
      });
    });
  });
});
