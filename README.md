
# InzynieraOprogramowania

## **Charakterystyka oprogramowania**
**Nazwa skrócona: Katalog planszówek**

**Pełna nazwa: System katalogowania gier planszowych**

**Opis: System stanowi aplikacją webową działającą w przeglądarce internetowej, zaprogramowanej z myślą o szybkim i intuicyjnym wyszukiwaniu gier planszowych. Aplikacja pobiera dane ze strony https://boardgamegeek.com. Aplikacja umożliwia użytkownikom przeglądanie katalogu gier planszowych, filtrowanie ich według określonych kryteriów oraz przeglądanie szczegółowych informacji o każdej grze.**

## Prawa Autorskie
Autorzy: Wiktoria Wnuk i Nataniel Piekarski

Rok: 2026

Licencja: MIT License (Licencja Otwarta / Open Source)

**Warunki Licencyjne**

*MIT License Copyright (c) [2026] [Wiktoria Wnuk, Nataniel Piekarski]
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*

## Specyfikacja wymagań
| Identyfikator | Nazwa | Opis | Priorytet | Kategoria |
|---------------|-------|------|-----------|-----------|
| I01 | Aplikacja| Aplikacja zbudowana w frameworku next.js. Odpowiedzialna za realizację funkcjonalności związanych z przetwarzaniem danych i prezentacją wyników działania filtrów | Wymagane | Funkcjonalne |
| I02 | Filtr według wieku | System musi umożliwiać filtrowanie gier według wieku gracza. Użytkownik może wybrać minimalny wiek gracza. Możliwe wartości: 6+; 8+; 10+; 12+; 14+; 16+; 18+ | Wymagane | Funkcjonalne |
| I03 | Filtr według liczby graczy | System musi umożliwiać filtrowanie gier według liczby graczy. Użytkownik może określić dokładną liczbę graczy. System wyświetla tylko gry, które obsługują wybraną liczbę graczy | Wymagane | Funkcjonalne |
| I04 | Filtr według kategorii | System musi umożliwiać filtrowanie gier według kategorii gry. Możliwe wartości: strategiczne; rodzinne; imprezowe; kooperacyjne; ekonomiczne; przygodowe; karciane; wojenne; abstrakcyjne; dedukcyjne; dziecięce | Wymagane | Funkcjonalne |
| I05 | Kombinacja filtrów | System musi umożliwiać jednoczesne stosowanie wielu filtrów. Wyniki wyszukiwania muszą spełniać wszystkie wybrane kryteria. System musi dynamicznie aktualizować wyniki po zmianie filtrów | Wymagane | Funkcjonalne |
| I06 | Dane | Podstawowe informacje o grach | Wymagane | Funkcjonalne |
| I07 | Wyświetlanie wyników | System musi prezentować wyniki w formie kafelków. Wyniki powinny być czytelne i przejrzyste | Wymagane | Funkcjonalne |
| I08 | Interfejs graficzny | Graficzny interfejs użytkownika zapewniający intuicyjną obsługę aplikacji z wizualizacją danych | Wymagane | Niefunkcjonalne |
| I09 | Widok szczegółowy | Po kliknięciu w tytuł gry użytkownik przechodzi do widoku szczegółów, gdzie widzi pełny opis, liczby graczy, czas gry, minimalny wiek oraz ocenę i inne informacje. | Przydatne | Funkcjonalne |
| I10 | Konta użytkownia | Graficzny interfejs użytkownika zapewniający intuicyjną obsługę aplikacji z wizualizacją danych | opcjonalne | Funkcjonalne |
| I11 | Katalog zapisanych pozycji | Katalog w którym wyświetlane są zapisane gry planszowe który zainteresowały nas  | opcjonalne | Funkcjonalne |

**Historyjka użytkownika**

**Jako:** użytkownik

**Chcę:** Wyszukać gry planszowe

**Żeby:** Móc dobrać idealną grę do okazji w której się znajduje. Chcę móc to zrobić przez filtrowanie katalogu gier w kategoriach: gatunek, wiek, ilość graczy, czas grania i średnia ocen oraz chciałbym znać krótki opis gry.

## Architektura rozwoju

System jest zbudowany jako aplikacja webowa typu klient–serwer, wykorzystująca Next.js w wersji 16.1.1 z App Router oraz React 19.2.3 i TypeScript 5. Warstwa frontendowa odpowiada za interfejs użytkownika, wyświetlanie katalogu gier, obsługę wyszukiwania oraz filtrów (wiek, liczba graczy, kategoria) oraz prezentację wyników w formie kafelków. Do stylowania i układu użyto Tailwind CSS v4. Frontend wysyła zapytania HTTP do backendu (Next.js API Routes), który działa jako warstwa pośrednia między aplikacją a zewnętrznym API BoardGameGeek. Backend, uruchamiany w środowisku Node.js 20+ LTS, odbiera żądania wyszukiwania, przekazuje je do BoardGameGeek API, a następnie pobiera odpowiedzi w formacie XML. Otrzymany XML jest parsowany przy pomocy biblioteki fast-xml-parser (wersja 5.3.3), przekształcany do formatu JSON, a następnie zwracany do frontend. Dzięki temu frontend otrzymuje dane w łatwym do przetwarzania formacie i może dynamicznie aktualizować wyniki bez przeładowania strony. Cały projekt korzysta z narzędzi developerskich takich jak npm do zarządzania zależnościami, ESLint do utrzymania jakości kodu oraz TypeScript Compiler do zapewnienia typowania statycznego i wykrywania błędów na etapie kompilacji.


### Frontend

| Technologia | Wersja | Przeznaczenie |
|-------------|--------|---------------|
| Next.js | 16.1.1 | Framework aplikacji |
| React | 19.2.3 | Biblioteka UI |
| TypeScript | 5.x | Typowanie statyczne |
| Tailwind CSS | V4 | Style i layout |

### Backend

| Technologia | Wersja | Przeznaczenie |
|-------------|--------|---------------|
| Next.js API Routes | 16.1.1 | Serverless Functions |
| xml2js | 5.3.3 | Parsowanie XML z BGG |
| Node.js | 20+ LTS | Środowisko uruchomieniowe |

### Narzędzia Developerskie

| Narzędzie | Przeznaczenie |
|-----------|---------------|
| npm | Zarządzanie zależnościami |
| ESLint | Linting kodu (reguły React/Next.js) |
| TypeScript Compiler | Ścisłe typowanie |
| Visual Studio Code | Edycja kodu |
| GitHub | repozytorium kodu i zarządzanie wersjami |

# Testy
________________________________________
**Test 1 — Wyszukiwanie gry (podstawowe)**

Cel: Sprawdzenie, czy system potrafi wyszukać grę po nazwie.

Kroki:
- Otworzyć stronę główną aplikacji.
- Wpisać nazwę gry w pole wyszukiwania (np. „Catan”).
- Kliknąć „Szukaj”.

Oczekiwany wynik:
- System wyświetla listę gier zawierających wpisaną nazwę.
- Każda gra zawiera podstawowe informacje (nazwa, rok, liczba graczy, czas, wiek, ocena).

________________________________________
**Test 2 — Filtr według wieku**

Cel: Sprawdzenie poprawności działania filtra wieku.

Kroki:
- Wyszukać dowolną grę lub wyświetlić katalog.
- Wybrać filtr wieku „12+”.
- Zastosować filtr.

Oczekiwany wynik:
- System wyświetla tylko gry, których minimalny wiek to 12+ lub więcej.
- Wyniki aktualizują się dynamicznie (bez odświeżania strony).	

________________________________________
**Test 3 — Filtr według liczby graczy**

Cel: Sprawdzenie, czy system filtruje gry według liczby graczy.

Kroki:
- Wybrać filtr liczby graczy: 4.
- Zastosować filtr.

Oczekiwany wynik:
- System pokazuje tylko gry, które obsługują dokładnie 4 graczy (min ≤ 4 ≤ max).
- Brak wyników poza tym zakresem.

________________________________________
**Test 4 — Filtr według kategorii**
	
Cel: Sprawdzenie poprawności działania filtra kategorii.

Kroki:
- Wybrać kategorię „strategiczne”.
- Zastosować filtr.

Oczekiwany wynik:
- System wyświetla tylko gry z kategorii „strategiczne”.

________________________________________
**Test 5 — Kombinacja filtrów**

Cel: Sprawdzenie działania filtrów jednocześnie.

Kroki:
- Wybrać wiek: 14+.
- Wybrać liczbę graczy: 2.
- Wybrać kategorię: „kooperacyjne”.
- Zastosować filtry.

Oczekiwany wynik:
- System pokazuje gry spełniające wszystkie kryteria jednocześnie.
- Wyniki aktualizują się dynamicznie.

________________________________________
**Test 6 — Czas odpowiedzi (wydajność)**

Cel: Sprawdzenie, czy filtrowanie działa szybko.

Kroki:
- Wykonać filtr (np. wiek 10+, liczba graczy 3).
- Zmierzyć czas odpowiedzi.

Oczekiwany wynik:
- Wyniki pojawiają się w czasie < 2 sekundy.


