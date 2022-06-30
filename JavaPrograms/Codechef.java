package JavaPrograms;

import java.util.Scanner;

class Codechef {
    public static void main(String[] args) throws java.lang.Exception {
        Scanner scanner = new Scanner(System.in);

        int T = scanner.nextInt();

        while (T-- > 0) {
            int n = scanner.nextInt();
            char arr[] = new char[n];
            for (int i = 0; i < n; i++) {
                arr[i] = scanner.next().charAt(0);
            }

            for (int i = 0; i < n; i++) {
                if (arr[i] == 'A') {
                    arr[i] = 'T';
                } else if (arr[i] == 'T') {
                    arr[i] = 'A';
                } else if (arr[i] == 'G') {
                    arr[i] = 'C';
                } else {
                    arr[i] = 'G';
                }
            }

            for (int i = 0; i < n; i++) {
                System.out.print(arr[i]);
            }
            System.out.println();
        }

        scanner.close();
    }
}
