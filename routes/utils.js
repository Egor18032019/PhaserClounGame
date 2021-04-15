const liFill = (arr) => {
    if (arr.length === 0) {
        return "Авторизуйтесь пожалуйста"
    } else {
        const foo = arr.map(
            (place) => {
                return (
                    // `<li>${JSON.stringify(place).replace(/[{}"]/g,"")}</li>`);
                    `<li>${place.name} = ${place.highScore}</li>`)
            })
        const bar = foo.join('')
        return (`<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link rel="stylesheet" href="css/style.css">
            <title>Phaser Scores</title>
            <script type="module" src="src/utils/get_score.js"></script>
        </head>
        <body>
        <main>
        <section class="rating">
            <h1>Таблица игроков</h1>
            <ul id="score__table">
                ${bar}
            </ul>
        </section>
        </main>
         </body>
        </html>`)
    }
}

module.exports = liFill;