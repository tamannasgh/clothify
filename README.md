so, this project is very basic clothing website, poeple can sell and buy clothes, the main motive is to learn firebase, and frontend things like protected routes, auth flow, providers, context etc.
we are also learning role based routes handling, and many more.
then for now we will just have the order button and order page which will show all ordered items, we can also have cart and after the completion of this much we will make a new branch for payment gateway feature and the motive of this feature is to learn payment gateway implementation and learn about git branching that really how git and github works.
now the clothes are not available so i will be using available images and random info like name info quantity size colors etc.

1. step one (identify problem and think about solution and how the things will work what users would be there.):

now what this project is for and what problem is it solving?

this website is for connecting the buyer and seller so that they can exchange clothes online.

users:

- Seller: seller can upload clothes and see the orders also update the uploaded item.
- Buyer: buyer can buy clothes and see theirs orders(cart) and they will pay (later).

conditions:

- buyer can not upload clothes.
- if item is out of stock buyer can't buy that.
- seller can not look at other seller's order, buyer can't look at other's cart.
- seller can update the items uploaded by them.

2. now the solution:

-> the collections i need in firebase:

- users (seller or buyer)
- clothes
- orders
- cart

-> what should the folder structure look like?

-> the flow of features

3. Start with smallest feature

- decide based on dependency, like buyer can browse only when seller has uploaded something, so first feature to be build should be seller upload feature

4. Break features into tiny pieces

- Break the feature you picked, Each piece should be completable in 1-2 hours.

5. Test as you go

- After each piece, verify it works.

6. Don't optimize early

- Get it working. Then make it pretty.

* How to think about ANY problem
  When someone says "Build X", think:
    1. UNDERSTAND
       "What is the user doing?"
       "What data matters?"
       "What are the rules?"

    2. DESIGN
       "What collections/tables?"
       "What routes?"
       "What features in order?"

    3. BREAK DOWN
       "What's the smallest piece?"
       "What depends on what?"

    4. IMPLEMENT
       "Database structure first"
       "UI without logic second"
       "Connect third"

    5. TEST
       "Does it work?"
       "Any edge cases?"

    6. REPEAT
       "Next feature"
