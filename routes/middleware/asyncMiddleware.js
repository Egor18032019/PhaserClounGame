const asyncMiddleware = fn =>

    (req, res, next) => {

        Promise.resolve(fn(req, res, next))

            .catch(next);

    };
/*
принимает другую функцию в качестве аргумента и заключает ее в промис.
В данном случае у нас эта передаваемая функция в промис является обработчиком маршрута.
Если есть ошибка, она будет здесь перехвачена и передана следующему промежуточному программному обеспечению.
 */


module.exports = asyncMiddleware;
/*
*/
