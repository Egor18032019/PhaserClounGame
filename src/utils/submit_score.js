// компонент "отпправка счета на сервер"

import {
    get_cookie,
    request
} from "../utils/utils.js"


const onSetupFormSubmit = function (score) {
    console.log(score, "score")
    let email = get_cookie("email")
    let data = {
        email: email,
        score: score
    }
    let next = request('/submit-score', 'POST', data).then((data) => self.location = "scores.html");

};

export default onSetupFormSubmit;