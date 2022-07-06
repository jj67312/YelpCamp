package JavaPrograms;

import java.util.*;

class Codechef {
  public static void main(String[] args) throws java.lang.Exception {
    Scanner sc = new Scanner(System.in);

    int T = sc.nextInt();

    while (T-- > 0) {
      int n = sc.nextInt();
      int arr[] = new int[n];
      for (int i = 0; i < n; i++) {
        arr[i] = sc.nextInt();
      }

      HashMap<Integer, Integer> map = new HashMap<>();
      for (int i = 0; i < n; i++) {
        if (map.containsKey(arr[i])) {
          map.put(arr[i], map.get(arr[i]) + 1);
        } else {
          map.put(arr[i], 1);
        }
      }

      boolean isPossible = true;
      for (Map.Entry<Integer, Integer> element : map.entrySet()) {
        if (element.getKey() == element.getValue()) {
          isPossible = true;
        } else {
          isPossible = false;
          break;
        }
      }

      if (isPossible) {
        System.out.println("Yes");
      } else {
        System.out.println("No");
      }

    }
    sc.close();
  }

  static void printArray(int arr[]) {
    System.out.println("\nArray: ");
    for (int i = 0; i < arr.length; i++) {
      System.out.print(arr[i] + " ");
    }
    System.out.println();
  }

}
