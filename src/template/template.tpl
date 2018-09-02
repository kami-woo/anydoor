<!DOCTYPE html>
<html>
<head>
  <title>{{ title }}</title>
  <style type="text/css">
    a {
      display: block;
      margin: 10px;
      font-size: 20px;
      text-decoration: none;
    }
  </style>
</head>
<body>
  {{#each files}}
    <a href="{{../dir}}/{{this}}">{{this}}</a>
  {{/each}}
</body>
</html>