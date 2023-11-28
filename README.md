# Desafios Fast Track - Ima tech

## **SharpCoders - Desafio de HTML, CSS, Bootstrap e JS**

Tendo como base os conteúdos abordados nas aulas de HTML, CSS, JavaScripte Bootstrap, desenvolva a seguinte atividade proposta:

Deverá ser desenvolvido um sistema para gerenciamento de tarefas, abaixo haverá um wireframe para mostrar a estrutura que você deverá implementar na versão para resoluções grandes:

Cores, imagens, fontes, animações, etc… Serão de responsabilidade dos desenvolvedores, fiquem à vontade para estilizar como quiserem, desde que respeitem o uso das tecnologias pedidas, lembrando que são: HTML, CSS, JavaScript e Bootstrap.

O projeto deverá ser responsivo, não haverá especificações de como os layouts deverão ser desenvolvidos para resoluções menores como: smartphones ou tablets, apenas para resoluções de telas maiores (desktops, notebooks e televisores).

As informações referentes ao gerenciamento das tarefas serão:

- Título da tarefa
- Data de início
- Horário de início
- Data de término
- Horário de término
- Descrição da tarefa

Na listagem das tarefas, deverá ter um status para indicar se determinada tarefa foi concluída ou não, você deve implementar os seguintes status:

- Pendente: Quando a tarefa ainda não foi feita.
- Em andamento: Quando a tarefa se encontra no prazo de início de término estipulado.
- Realizada: Quando é especificada que a tarefa foi feita.
- Em Atraso: Quando a tarefa não foi realizada no prazo estabelecido.

Veja abaixo um exemplo da estrutura em funcionamento:

Página inicial:

![Alt text](https://lh7-us.googleusercontent.com/aGsnSJk4_q43ifMaU-Z6QkUM_D3GbcnuPJKlSpoLM610G1z_qmcWjcCFMfBgCjJ323iNvJFX5GJdfDy7K3ZmkUCGLz3mQ0Eyxuvxz2FL7iIAJBDwkiazVnn-OSwaY_WzIibs_UR-yU-l-u8ND7hv1PU)

Ao realizar o login ou a criação de uma conta, deverá ser exibida a seguinte página:

![Alt text](https://lh7-us.googleusercontent.com/zEArQW8iXY6SBuM5lbb_YnyWKt0ELvBi5eSpgJwVY7c7xZLEO7TnOCVR02IdSd-Kdt2W2mKUFqaC0PbObV3top654Saxe-aebNHk7kZ1jlJHUdfFTt1-zbBBrwZofY21HkOKGIJSppiZfxfR9s_aMwA)

Na tabela, ao clicar no nome da tarefa, deverá abrir um modal contendo a descrição dela:

![Alt text](https://lh7-us.googleusercontent.com/D6YiuddO8LQwFJVzCKnB9tpUskz6YXJ7K4g5Sx2TLsI_BOX7WOxIi50SQfHoI80OSaRkBcoCuJx0hgonOjniKtvYqXET-8jvGH7W8213KadkVTRS2cmcXWF67Uiujx5Ccs6Nz9YwXRNLjC1JMSXlkWs)

Ainda na tabela, haverá um botão para alterarmos as nossas tarefas, ao clicar neste botão, o formulário deverá preencher com os dados da tarefa, além de exibirmos novos botões, contendo as seguintes ações:

- Alterar tarefa
- Remover tarefa
- Marcar como realizada
- Cancelar

![Alt text](https://lh7-us.googleusercontent.com/nyCs_avn4_RdnwiOjXVYlPzmG06LyRJYWcCQX2NsZmNoL-pFZbFp_qarPG4t7gxVWfuVwtVySYhHoMwgUXIC3q6y3NJ0T8eSutlvPYOd19xBKkJDluIZR2vvO1qlp6xz_XryWp2UdKY-mPfGQF_XLeA)

Independente do status que estiver a tarefa (pendente, em andamento ou atraso), podemos alterar seu status para realizada.

Tarefas que foram realizadas, ao invés de ter o botão **Marcar como realizada**, deverá ter um outro botão **Marcar como não realizada**, ao clicar, a tarefa deve voltar ao status condizente com as datas informadas (pendente, não realizada ou em andamento).

Na barra superior, onde temos o nome e o link para sair, será obrigatório:

- Exibir uma mensagem contendo o nome do cliente (você define a mensagem).
- Criar um link para sair, onde volta para a página inicial, contendo o formulário de autenticação e criação de conta.