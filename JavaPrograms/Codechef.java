package JavaPrograms;

import java.util.*;

class Codechef {
    public static void main(String[] args) throws java.lang.Exception {
        Scanner sc = new Scanner(System.in);

        solve();

        sc.close();
    }

    static void printArray(int arr[]) {
        System.out.println("\nArray: ");
        for (int i = 0; i < arr.length; i++) {
            System.out.print(arr[i] + " ");
        }
        System.out.println();
    }

    static void solve() {
        Scanner scanner = new Scanner(System.in);

        String s1 = scanner.nextLine();
        String s2 = scanner.nextLine();

        char arr1[] = s1.toCharArray();
        char arr2[] = s2.toCharArray();

        int p1 = 0, p2 = 0;
        int n1 = arr1.length;
        int n2 = arr2.length;
        int equalCount = 0;

        int p1Copy = -1;

        while (p1Copy != 0) {
            if (arr1[p1] == arr2[p2]) {
                System.out.println();
                System.out.println("p1 = " + p1);
                System.out.println("p2 = " + p2);
                System.out.println("p1Copy = " + p1Copy);
                System.out.println("equalcount = " + equalCount);
                System.out.println("arr1[p1] = " + arr1[p1]);
                System.out.println("arr2[p2] = " + arr2[p2]);
                System.out.println();
                p1 = (p1 + 1) % n1;
                p1Copy = p1;
                p2 = (p2 + 1) % n2;
                equalCount++;
            } else {
                p2 = (p2 + 1) % n2;
                equalCount = 0;
            }
        }

        if (equalCount == n1) {
            System.out.println("Yes");
        } else {
            System.out.println("No");
        }

        scanner.close();
    }
}
