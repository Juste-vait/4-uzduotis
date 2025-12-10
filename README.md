# 4-uzduotis

## Verslo modelio ir logikos aprašymas
1. Įvadas
Pasirinktas verslo modelis realizuoja decentralizuotą bilietų pardavimo ir validavimo sistemą. Šios sistemos tikslas – užtikrinti skaidrų, patikimą ir nekintamą bilietų pardavimo procesą, pasitelkiant išmaniąją sutartį Ethereum tinkle. Sprendimas eliminuoja tarpininkus, padidina pasitikėjimą tarp dalyvių ir užtikrina, kad bilietų pirkimo bei patvirtinimo duomenys būtų vieši, tikslūs ir nekeičiami.
Sistema naudoja Ethereum išmaniąją sutartį (Smart Contract), sukurtą Solidity kalba, ir decentralizuotą aplikaciją (DApp), kuri leidžia vartotojams sąveikauti su kontraktu per patogią vartotojo sąsają.
 
2. Verslo modelio veikėjai
Organizatorius
Tai renginio savininkas, kuris:
- sukuria renginį,
- nurodo bilieto kainą ir bilietų kiekį,
- paskiria validatoriaus adresą,
- po renginio pasiima surinktas lėšas iš išmaniosios sutarties.
Organizatorius yra kontrakto diegėjas (contract owner).
 
Pirkėjas
Tai bet kuris vartotojas, norintis įsigyti bilietą.
Pirkėjas:
- prisijungia prie DApp per MetaMask,
- atlieka saugų bilieto pirkimą siųsdamas ETH į išmaniąją sutartį,
- gauna patvirtinimą, kad jam priklauso bilietas.
Pirkėjo bilieto turėjimas saugomas kontrakto būsenos kintamuosiuose.
 
Validatorius
Tai renginio darbuotojas, atsakingas už dalyvių bilietų tikrinimą prie įėjimo.
Validatorius:
- gauna specialias teises validuoti bilietus,
- pažymi bilietą kaip panaudotą,
- užtikrina, kad tas pats bilietas nebūtų panaudotas antrą kartą.
Validatoriaus adresą nurodo organizatorius kontrakto kūrimo metu.

-------------------------------------

## Sekos diagrama
![Sekos diagrama](1.jpeg)

1. Deploy
Organizatorius įkelia („deploy“) išmaniąją sutartį į Ethereum tinklą, nurodydamas bilieto kainą, maksimalų bilietų kiekį ir validatoriaus adresą. Kontraktas išsaugo organizatorių kaip sutarties savininką.
 
2. Buy ticket
Pirkėjas inicijuoja bilieto įsigijimą iškviesdamas funkciją buyTicket().

3. Check ticket
Renginio dieną validatorius patikrina, ar lankytojo adresas turi galiojantį bilietą, iškviesdamas smart contract funkciją, kuri grąžina hasTicket(address) reikšmę.
 
4. Validate ticket
Jeigu bilietas yra galiojantis, validatorius iškviečia validateTicket(address) funkciją.
 
6. Ticket validated [event]
Kontraktas pažymi bilietą kaip panaudotą (hasTicket[address] = false) ir išleidžia TicketValidated event’ą. Tai signalas validatoriaus sistemai, kad bilietas buvo panaudotas ir nebegali būti panaudotas dar kartą.
 
7. Withdraw
Pasibaigus renginiui organizatorius iškviečia funkciją withdraw() norėdamas atsiimti visą kontrakte sukauptą ETH sumą.
 
8. Payout
Kontraktas patikrina, kad lėšas bando atsiimti būtent organizatorius (msg.sender == organizer). Jeigu taip, kontraktas perveda visą savo balansą į organizatoriaus Ethereum adresą.
