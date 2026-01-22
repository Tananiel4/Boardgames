# InzynieraOprogramowania
Specyfikacja Wymagań
System katalogowania gier planszowych
1.	Wstęp
Prawa Autorskie
Autorzy: Wiktoria Wnuk i Nataniel Piekarski
Rok: 2026
Licencja: MIT License (Licencja Otwarta / Open Source)
Warunki Licencyjne
MIT License Copyright (c) [2026] [Wiktoria Wnuk, Nataniel Piekarski]
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

1.1 Cel dokumentu
Celem niniejszego dokumentu jest określenie wymagań funkcjonalnych i niefunkcjonalnych dla systemu informatycznego służącego do gromadzenia, przetwarzania i prezentowania danych o grach planszowych w postaci katalogu z możliwością filtrowania.
1.2 Zakres systemu
System umożliwia użytkownikom przeglądanie katalogu gier planszowych, filtrowanie ich według określonych kryteriów oraz przeglądanie szczegółowych informacji o każdej grze. Administratorzy systemu mogą dodawać, edytować i usuwać dane dotyczące gier.
1.3 Definicje i skróty
•	Gra planszowa – fizyczna gra towarzyska rozgrywana przy użyciu planszy, kart, pionków lub innych elementów.
•	Użytkownik – osoba korzystająca z katalogu gier.
•	Filtr – mechanizm pozwalający zawęzić wyniki wyszukiwania według określonych kryteriów.
•	System – aplikacja do wyszukiwania gier planszowych.

2. Opis ogólny
2.1 Perspektywa produktu
System stanowi aplikacją webową działającą w przeglądarce internetowej, zaprogramowanej z myślą o szybkim i intuicyjnym wyszukiwaniu gier planszowych. Aplikacja pobiera dane ze strony https://boardgamegeek.com.
2.2 Funkcje systemu
•	Wyszukiwanie gier planszowych
•	Filtrowanie i sortowanie gier według: liczby graczy, kategorii oraz wieku graczy
•	Wyświetlanie listy wyników wyszukiwania
•	Prezentacja szczegółowych informacji o grze (opis, liczba graczy, czas trwania gry, wiek graczy, opinie użytkowników)
2.3 Charakterystyka użytkowników
•	Użytkownik końcowy – osoba poszukująca gry planszowej spełniającej określone kryteria, bez konieczności logowania.
2.4 Ograniczenia
•	System działa wyłącznie w środowisku przeglądarki internetowej
•	Język interfejsu: polski

3. Wymagania funkcjonalne
3.1 Wyszukiwanie i filtrowanie gier

3.1.1 Filtr według wieku
•	System musi umożliwiać filtrowanie gier według wieku gracza
•	Użytkownik może wybrać minimalny wiek gracza
•	Możliwe wartości: 6+; 8+; 10+; 12+; 14+; 16+; 18+

3.1.2 Filtr według liczby graczy
•	System musi umożliwiać filtrowanie gier według liczby graczy
•	Użytkownik może określić dokładną liczbę graczy
•	System wyświetla tylko gry, które obsługują wybraną liczbę graczy

3.1.3 Filtr według kategorii
•	System musi umożliwiać filtrowanie gier według kategorii gry
•	Możliwe wartości: strategiczne; rodzinne; imprezowe; kooperacyjne; ekonomiczne; przygodowe; karciane; wojenne; abstrakcyjne; dedukcyjne; dziecięce

3.1.4 Kombinacja filtrów
•	System musi umożliwiać jednoczesne stosowanie wielu filtrów
•	Wyniki wyszukiwania muszą spełniać wszystkie wybrane kryteria
•	System musi dynamicznie aktualizować wyniki po zmianie filtrów

3.2 Dane gry planszowej
Każda gra powinna zawierać co najmniej następujące informacje:
•	Nazwa gry
•	Rok wydania
•	Liczba graczy (min/max)
•	Czas rozgrywki
•	Wiek minimalny graczy
•	Typ gry (np. strategiczna, rodzinna, imprezowa)
•	Wstępny opis gry
•	Średnia ocena gry (w skali 1-10)

3.3 Wyświetlanie wyników wyszukiwania
•	System musi prezentować wyniki w formie kafelków
•	Wyniki powinny być czytelne i przejrzyste

4. Wymagania niefunkcjonalne

4.1 Wydajność
•	System powinien zwracać wyniki filtrowania w czasie nie dłuższym niż 2 sekundy
•	Zmiana filtrów powinna być płynna

4.2 Użyteczność
•	Interfejs użytkownika powinien być intuicyjny i łatwy w obsłudze
•	Filtry powinny być wyraźnie widoczne i łatwo dostępne
•	Nawigacja powinna być prosta i logiczna

5. Wymagania techniczne
•	Backend: Next.js API Routes, fast-xml-parser v5.3.3
•	Frontend: Next.js 16.1.1 (App Router), UI: React 19.2.3, TypeScript5
•	Baza danych: BoardGameGeek (BGG) API (format XML)
•	Architektura: klient–serwer
•	Model: aplikacja webowa

6. Możliwe rozszerzenia systemu
•	Konta użytkowników i listy ulubionych gier
•	Dodatkowe filtry (wydawca, rok, wydania, poziom trudności)
•	Opcja sortowania gier (np. alfabetycznie, według roku wydania)
•	Funkcja porównywania gier
•	Wersja aplikacji mobilnej
•	Wyświetlanie podstron prowadzących do każdej gry

7. Testy

Test 1 — Wyszukiwanie gry (podstawowe)
•	Cel: Sprawdzenie, czy system potrafi wyszukać grę po nazwie.
Kroki:
•	Otworzyć stronę główną aplikacji.
•	Wpisać nazwę gry w pole wyszukiwania (np. „Catan”).
•	Kliknąć „Szukaj”.
Oczekiwany wynik:
•	System wyświetla listę gier zawierających wpisaną nazwę.
•	Każda gra zawiera podstawowe informacje (nazwa, rok, liczba graczy, czas, wiek, ocena).

________________________________________
Test 2 — Filtr według wieku
•	Cel: Sprawdzenie poprawności działania filtra wieku.
Kroki:
•	Wyszukać dowolną grę lub wyświetlić katalog.
•	Wybrać filtr wieku „12+”.
•	Zastosować filtr.
Oczekiwany wynik:
•	System wyświetla tylko gry, których minimalny wiek to 12+ lub więcej.
•	Wyniki aktualizują się dynamicznie (bez odświeżania strony).	

________________________________________
Test 3 — Filtr według liczby graczy
•	Cel: Sprawdzenie, czy system filtruje gry według liczby graczy.
Kroki:
•	Wybrać filtr liczby graczy: 4.
•	Zastosować filtr.
Oczekiwany wynik:
•	System pokazuje tylko gry, które obsługują dokładnie 4 graczy (min ≤ 4 ≤ max).
•	Brak wyników poza tym zakresem.

________________________________________
Test 4 — Filtr według kategorii
•	Cel: Sprawdzenie poprawności działania filtra kategorii.
Kroki:
•	Wybrać kategorię „strategiczne”.
•	Zastosować filtr.
Oczekiwany wynik:
•	System wyświetla tylko gry z kategorii „strategiczne”.

________________________________________
Test 5 — Kombinacja filtrów
•	Cel: Sprawdzenie działania filtrów jednocześnie.
Kroki:
•	Wybrać wiek: 14+.
•	Wybrać liczbę graczy: 2.
•	Wybrać kategorię: „kooperacyjne”.
•	Zastosować filtry.
Oczekiwany wynik:
•	System pokazuje gry spełniające wszystkie kryteria jednocześnie.
•	Wyniki aktualizują się dynamicznie.

________________________________________
Test 6 — Czas odpowiedzi (wydajność)
•	Cel: Sprawdzenie, czy filtrowanie działa szybko.
Kroki:
•	Wykonać filtr (np. wiek 10+, liczba graczy 3).
•	Zmierzyć czas odpowiedzi.
Oczekiwany wynik:
•	Wyniki pojawiają się w czasie < 2 sekundy.


