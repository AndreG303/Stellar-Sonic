d3.select();
d3.selectAll();

d3.select('h1').style('color', 'red')
.attr('class','heading')
.text('new h1');

d3.select('body').append('p').text('first paragraph');
d3.select('body').append('p').text('second paragraph');
d3.select('body').append('p').text('third paragraph');

d3.selectAll('p').style('color','blue');