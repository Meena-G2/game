#include <stdio.h>
#include <math.h>

int main() {
    int choice, dec = 0, i, rem;
    long bin, oct;
    char hex[20];

    printf("\nNUMBER CONVERSION PROGRAM\n");
    printf("1. Decimal to Binary\n");
    printf("2. Decimal to Octal\n");
    printf("3. Decimal to Hexadecimal\n");
    printf("4. Binary to Decimal\n");
    printf("5. Binary to Octal\n");
    printf("6. Binary to Hexadecimal\n");
    printf("7. Octal to Decimal\n");
    printf("8. Octal to Binary\n");
    printf("9. Octal to Hexadecimal\n");
    printf("10. Hexadecimal to Decimal\n");
    printf("11. Hexadecimal to Binary\n");
    printf("12. Hexadecimal to Octal\n");
    printf("Enter your choice: ");
    scanf("%d", &choice);

    switch (choice) {

        case 1:
            printf("Enter decimal: ");
            scanf("%d", &dec);
            printf("Binary = ");
            for (i = 31; i >= 0; i--)
                printf("%d", (dec >> i) & 1);
            break;

        case 2:
            printf("Enter decimal: ");
            scanf("%d", &dec);
            printf("Octal = %o", dec);
            break;

        case 3:
            printf("Enter decimal: ");
            scanf("%d", &dec);
            printf("Hexadecimal = %X", dec);
            break;

        case 4:
            printf("Enter binary: ");
            scanf("%ld", &bin);
            dec = 0; i = 0;
            while (bin != 0) {
                rem = bin % 10;
                dec += rem * pow(2, i++);
                bin /= 10;
            }
            printf("Decimal = %d", dec);
            break;

        case 5:
            printf("Enter binary: ");
            scanf("%ld", &bin);
            dec = 0; i = 0;
            while (bin != 0) {
                rem = bin % 10;
                dec += rem * pow(2, i++);
                bin /= 10;
            }
            printf("Octal = %o", dec);
            break;

        case 6:
            printf("Enter binary: ");
            scanf("%ld", &bin);
            dec = 0; i = 0;
            while (bin != 0) {
                rem = bin % 10;
                dec += rem * pow(2, i++);
                bin /= 10;
            }
            printf("Hexadecimal = %X", dec);
            break;

        case 7:
            printf("Enter octal: ");
            scanf("%ld", &oct);
            dec = 0; i = 0;
            while (oct != 0) {
                rem = oct % 10;
                dec += rem * pow(8, i++);
                oct /= 10;
            }
            printf("Decimal = %d", dec);
            break;

        case 8:
            printf("Enter octal: ");
            scanf("%ld", &oct);
            dec = 0; i = 0;
            while (oct != 0) {
                rem = oct % 10;
                dec += rem * pow(8, i++);
                oct /= 10;
            }
            printf("Binary = ");
            for (i = 31; i >= 0; i--)
                printf("%d", (dec >> i) & 1);
            break;

        case 9:
            printf("Enter octal: ");
            scanf("%ld", &oct);
            dec = 0; i = 0;
            while (oct != 0) {
                rem = oct % 10;
                dec += rem * pow(8, i++);
                oct /= 10;
            }
            printf("Hexadecimal = %X", dec);
            break;

        case 10:
            printf("Enter hexadecimal: ");
            scanf("%s", hex);
            sscanf(hex, "%x", &dec);
            printf("Decimal = %d", dec);
            break;

        case 11:
            printf("Enter hexadecimal: ");
            scanf("%s", hex);
            sscanf(hex, "%x", &dec);
            printf("Binary = ");
            for (i = 31; i >= 0; i--)
                printf("%d", (dec >> i) & 1);
            break;

        case 12:
            printf("Enter hexadecimal: ");
            scanf("%s", hex);
            sscanf(hex, "%x", &dec);
            printf("Octal = %o", dec);
            break;

        default:
            printf("Invalid choice");
    }

    return 0;
}