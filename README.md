# Твой карманный Депресометр

Этот проект - пример AnyTest Software. Принцип работы созданя психологических тестов следующий.
Данные тестов должны иметь формат
[
 {
      content: "Текст ответа",
      score: <балл за ответ>,
      selected: false
    }
]

Выдача ответов через переменные

const maximalValues = [<количество баллов для ответа с нужным индексом>];

const systemAnswersByValues = [
  0: <ответ>
];

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/web-platform-fdbecs)
